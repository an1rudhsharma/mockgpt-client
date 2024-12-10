import { Captions } from '@/interfaces/types';
import { clearAudioQueue, playNextInQueue } from '@/utils/audioUtils';
import { useState, useRef, useCallback } from 'react';

interface WebSocketHook {
    isJoined: boolean;
    loading: boolean;
    socketRef: React.MutableRefObject<WebSocket | null>;
    captions: Captions[];
    makeSocketConnection: () => void;
}

const messages: Captions[] = [
    {
        id: 1,
        sender: "Alex",
        text: "Hello Abhay, How was your day? Let's start with your backend interview. ",
        timestamp: new Date()
    },
]


export const useWebSocket = (): WebSocketHook => {
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [captions, setCaptions] = useState<Captions[]>(messages);
    const socketRef = useRef<WebSocket | null>(null);
    const isPlayingRef = useRef<boolean>(false);
    const audioQueueRef = useRef<string[]>([]);
    const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const makeSocketConnection = useCallback(() => {
        try {
            setLoading(true);
            const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const transcript: string[] = [];

            socket.onopen = () => {
                socketRef.current = socket;
                console.log("client: connected to server");
            };

            socket.addEventListener("message", async (message: any) => {
                if (message === "") return;

                try {
                    const data = JSON.parse(message.data);

                    if (data === 'deepgram is active') {
                        setIsJoined(true);
                        setLoading(false);
                    }

                    if (data?.event === 'playAudio') {
                        audioQueueRef.current.push(data.media.payload);
                        playNextInQueue(audioContext, audioQueueRef, transcript, isPlayingRef, currentAudioSourceRef, setCaptions);
                    }

                    if (data?.event === 'clear') {
                        // Clearing all queued audios and text messages
                        clearAudioQueue(audioQueueRef, currentAudioSourceRef);
                        transcript.length = 0
                    }

                    if (data?.event === 'text') {
                        transcript.push(data.media.payload);
                    }

                    if (data?.event === 'user') {
                        setCaptions((prev) => [...prev, {
                            id: Math.ceil(Math.random() * 10000),
                            sender: "user",
                            text: data.media.payload,
                            timestamp: new Date()
                        }])
                    }
                } catch (error) {
                    console.error("Failed to parse JSON:", error);
                }
            });

            socket.onclose = () => {
                setIsJoined(false);
                setCaptions([]);
                isPlayingRef.current = false;
                audioQueueRef.current = [];
                currentAudioSourceRef.current?.stop();
                currentAudioSourceRef.current = null;

                socketRef.current = null;
                console.log("client: disconnected from server");
            };
        } catch (error) {
            console.error("Socket connection error:", error);
            setLoading(false);
        }
    }, []);

    return { isJoined, loading, socketRef, captions, makeSocketConnection };
};
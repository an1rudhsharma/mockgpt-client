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
        text: "Hello Abhay, How was your day? Let's start with your backend interview",
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
                        console.log("clear audio")
                        clearAudioQueue(audioQueueRef, currentAudioSourceRef);
                    }

                    if (data?.event === 'text') {
                        transcript.push(data.media.payload);
                    }
                } catch (error) {
                    console.error("Failed to parse JSON:", error);
                }
            });

            socket.onclose = () => {
                console.log("client: disconnected from server");
            };
        } catch (error) {
            console.error("Socket connection error:", error);
            setLoading(false);
        }
    }, []);

    return { isJoined, loading, socketRef, captions, makeSocketConnection };
};
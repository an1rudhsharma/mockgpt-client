import { useRef, useState } from "react";

export const useMicrophone = (socketRef: React.MutableRefObject<WebSocket | null>) => {
    const audioStream = useRef<MediaStream | null>(null);
    const microphone = useRef<MediaRecorder | null>(null);
    const [isMicropohoneOn, setIsMicrophoneOn] = useState<boolean>(false)

    const changeMicrophoneState = async () => {
        try {
            if (!microphone.current) {
                let stream = audioStream.current;

                if (!stream) {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioStream.current = stream;
                }

                const myMicrophone = new MediaRecorder(stream, { mimeType: "audio/webm" });
                microphone.current = myMicrophone;

                await openMicrophone(microphone, socketRef);
                setIsMicrophoneOn(true)
            } else {
                closeMicrophone(microphone, audioStream);
                setIsMicrophoneOn(false)
            }
        } catch (error) {
            handleMicrophoneError(error);
        }
    };

    return { microphone, changeMicrophoneState, isMicropohoneOn };
};

const openMicrophone = (
    microphone: React.MutableRefObject<MediaRecorder | null>,
    socketRef: React.MutableRefObject<WebSocket | null>,
) => {
    return new Promise((resolve, reject) => {
        if (microphone.current) {
            microphone.current.onstart = () => {
                console.log("client: microphone opened");
                resolve(0);
            };

            microphone.current.onstop = () => {
                if (microphone.current) {
                    microphone.current.onstart = null;
                    microphone.current.onstop = null;
                    microphone.current.ondataavailable = null;
                    microphone.current = null;
                    console.log("client: microphone closed");
                }
            };

            microphone.current.ondataavailable = (event: BlobEvent) => {
                if (
                    event.data.size > 0 &&
                    socketRef.current &&
                    socketRef.current.readyState === WebSocket.OPEN
                ) {
                    socketRef.current.send(event.data);
                }
            };

            try {
                microphone.current.start(1000);
            } catch (error) {
                reject(error);
            }
        }
    });
};

const closeMicrophone = (
    microphone: React.MutableRefObject<MediaRecorder | null>,
    audioStream: React.MutableRefObject<MediaStream | null>
) => {
    if (microphone.current) {
        microphone.current.stop();
    }

    if (audioStream.current) {
        audioStream.current.getTracks().forEach(track => track.stop());
        audioStream.current = null;
    }
};

const handleMicrophoneError = (error: unknown) => {
    if (error instanceof DOMException) {
        switch (error.name) {
            case 'NotAllowedError':
                alert('Microphone access denied. Please grant permissions.');
                break;
            case 'NotFoundError':
                alert('No microphone device found.');
                break;
            default:
                console.error('Microphone error:', error.message);
        }
    } else {
        console.error('Unexpected error:', error);
    }
};
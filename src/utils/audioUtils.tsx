import { Captions } from "@/interfaces/types";

export const base64ToArrayBuffer = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

export const playNextInQueue = async (
    audioContext: AudioContext,
    audioQueueRef: React.MutableRefObject<string[]>,
    transcript: string[],
    isPlayingRef: React.MutableRefObject<boolean>,
    currentAudioSourceRef: React.MutableRefObject<AudioBufferSourceNode | null>,
    setCaptions: React.Dispatch<React.SetStateAction<Captions[]>>
) => {


    if (audioQueueRef.current.length === 0 || isPlayingRef.current) {
        console.log('isPlayingRef');
        return;
    };

    const audioData = audioQueueRef.current.shift()!;
    const transcriptText = transcript.shift() as string;

    isPlayingRef.current = true;

    try {
        const arrayBuffer = base64ToArrayBuffer(audioData);
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        setCaptions((prev) => [...prev, {
            id: Math.ceil(Math.random() * 1000),
            sender: "Alex",
            text: transcriptText,
            timestamp: new Date()
        }]);

        source.connect(audioContext.destination);
        source.start();

        currentAudioSourceRef.current = source;

        source.onended = () => {
            isPlayingRef.current = false;
            console.log('audio end');

            playNextInQueue(audioContext, audioQueueRef, transcript, isPlayingRef, currentAudioSourceRef, setCaptions);
        };
    } catch (error) {
        console.error("Error decoding or playing audio chunk:", error);
        isPlayingRef.current = false;
        playNextInQueue(audioContext, audioQueueRef, transcript, isPlayingRef, currentAudioSourceRef, setCaptions);
    }
};

export const clearAudioQueue = (audioQueueRef: React.MutableRefObject<string[]>, currentAudioSourceRef: React.MutableRefObject<AudioBufferSourceNode | null>) => {
    audioQueueRef.current.length = 0;
    currentAudioSourceRef.current?.stop();
};
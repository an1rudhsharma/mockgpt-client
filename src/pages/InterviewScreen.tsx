import { Users } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWebSocket } from '@/hooks/useSocket'
import { useMicrophone } from '@/hooks/useMicrophone'
import { ChatScreen, JoinCall, VideoCallView } from '@/components/InterviewScreenComps'

export default function InterviewPage() {
    const { type } = useParams();
    const {
        isJoined,
        loading,
        socketRef,
        captions,
        makeSocketConnection
    } = useWebSocket();

    const { isMicropohoneOn, changeMicrophoneState } = useMicrophone(socketRef);

    useEffect(() => {
        console.log('Interview type:', type);
    }, [type]);

    return (
        <div className="h-screen bg-[#1C1C1C] text-white p-6">
            {!loading ? (
                <>
                    <Link to='/' className="flex items-center gap-2 mb-8">
                        <div className="bg-purple-600 p-1.5 rounded">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold">Interview</span>
                    </Link>

                    <div className="flex flex-col md:flex-row gap-5 items-center justify-center px-20 py-10 h-full max-h-[calc(100vh-120px)]">
                        <div className="w-[75%]">
                            <VideoCallView
                                isJoined={isJoined}
                                isMicropohoneOn={isMicropohoneOn}
                                changeMicrophoneState={changeMicrophoneState}
                            />
                        </div>

                        <div className="w-[25%] flex flex-col items-center justify-center h-full">
                            {!isJoined ? (
                                <JoinCall
                                    onClick={makeSocketConnection}
                                    loading={loading}
                                />
                            ) : (
                                <ChatScreen captions={captions} />
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className='flex h-full items-center justify-center text-5xl'>
                    Loading...
                </div>
            )}
        </div>
    );
}

// export default function InterviewPage() {
//     const { type } = useParams()
//     console.log(type)

//     const [isJoined, setIsJoined] = useState<boolean>(false);


//     const socketRef = useRef<WebSocket | null>(null)
//     const isPlayingRef = useRef<boolean>(false)
//     const currentAudioSourceRef = useRef<any>(false)

//     const audioStream = useRef<MediaStream | null>(null);
//     const microphone = useRef<MediaRecorder | null>(null);

//     const [captions, setCaptions] = useState<Captions[]>(messages)
//     const [loading, setLoading] = useState(false);

//     const makeSocketConnection = () => {
//         try {
//             setLoading(true)
//             console.log('backend url: ', import.meta.env.VITE_WEBSOCKET_URL)
//             const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
//             const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//             const audioQueue: any = [];
//             const transcript: any = [];

//             socket.onopen = async () => {
//                 console.log('ks dvj sdvk')
//                 socketRef.current = socket;
//                 console.log("client: connected to server");
//             };

//             socket.addEventListener("message", async (message: any) => {
//                 if (message === "") {
//                     return;
//                 }

//                 let data;
//                 try {
//                     data = JSON.parse(message.data);
//                     if (data == 'deepgram is active') {
//                         setIsJoined(true);
//                         setLoading(false)
//                     }
//                     if (data && data.event == 'playAudio') {
//                         // Decode the incoming ArrayBuffer into an AudioBuffer
//                         const payload = data.media.payload
//                         audioQueue.push(payload);
//                         playNextInQueue(audioContext, audioQueue, transcript)
//                     }
//                     else if (data && data.event == 'clear') {
//                         audioQueue.length = 0
//                         if (currentAudioSourceRef.current) {
//                             currentAudioSourceRef.current.stop();
//                             currentAudioSourceRef.current.disconnect();
//                         }
//                     }
//                     else if (data.event == 'text') {
//                         transcript.push(data.media.payload)
//                     }
//                 } catch (e) {
//                     console.error("Failed to parse JSON:", e);
//                     return;
//                 }
//             });

//             socket.onclose = () => {
//                 console.log("client: disconnected from server");
//             }
//         } catch (error) {

//         }
//     }

//     const base64ToArrayBuffer = (base64: any) => {
//         const binaryString = atob(base64);
//         const len = binaryString.length;
//         const bytes = new Uint8Array(len);
//         for (let i = 0; i < len; i++) {
//             bytes[i] = binaryString.charCodeAt(i);
//         }
//         return bytes.buffer;
//     }

//     const playNextInQueue = async (audioContext: any, audioQueue: any[], transcript: string[]) => {
//         if (audioQueue.length === 0 || isPlayingRef.current) {
//             return;
//         };
//         const audioData = audioQueue.shift();

//         const transcriptText = transcript.shift() as string
//         isPlayingRef.current = true

//         try {
//             const arrayBuffer = base64ToArrayBuffer(audioData);
//             const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//             // Create a new source and play the audio
//             const source = audioContext.createBufferSource();
//             source.buffer = audioBuffer;
//             setCaptions((prev) => [...prev, {
//                 id: Math.ceil(Math.random() * 1000),
//                 sender: "Alex",
//                 text: transcriptText,
//                 timestamp: new Date()
//             },])
//             source.connect(audioContext.destination);
//             source.start();

//             // if (currentAudioSource) {}
//             currentAudioSourceRef.current = source;

//             // When audio finishes, isPlaying is false and play the next audio
//             source.onended = () => {
//                 // setIsPlaying(false);
//                 isPlayingRef.current = false
//                 playNextInQueue(audioContext, audioQueue, transcript);
//             };
//         } catch (error) {
//             console.error("Error decoding or playing audio chunk:", error);
//             // setIsPlaying(false);
//             isPlayingRef.current = false
//             playNextInQueue(audioContext, audioQueue, transcript); // Continue to the next in case of an error
//         }
//     };

//     async function changeMicrophoneState() {
//         try {
//             // Get Microphone
//             if (!microphone.current) {
//                 let stream = audioStream.current;
//                 // Check if an existing stream is available
//                 if (!stream) {
//                     console.log('new stream')
//                     stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//                     audioStream.current = stream;
//                 }

//                 const myMicrophone = new MediaRecorder(stream, { mimeType: "audio/webm" });
//                 microphone.current = myMicrophone;

//                 await openMicrophone();

//                 console.log('Microphone accessed successfully')

//             }
//             // Close Microphone
//             else {
//                 microphone.current.stop();

//                 // Stop the audio stream
//                 if (audioStream.current) {
//                     audioStream.current.getTracks().forEach(track => track.stop());
//                     audioStream.current = null;
//                 }
//                 console.log('Close microphone')
//             }
//         } catch (error: unknown) {
//             if (error instanceof DOMException) {
//                 if (error.name === 'NotAllowedError') {
//                     alert('Microphone access denied. Please grant permissions.');
//                 } else if (error.name === 'NotFoundError') {
//                     alert('No microphone device found.');
//                 } else {
//                     console.error('Microphone error:', error.message);
//                 }
//             } else {
//                 console.error('Unexpected error:', error);
//             }
//         }
//     }

//     async function openMicrophone() {
//         return new Promise((resolve, reject) => {
//             if (microphone.current) {

//                 console.log('Adding event listeners to microphone')

//                 microphone.current.onstart = () => {
//                     console.log("client: microphone opened");
//                     resolve(0);
//                 };

//                 microphone.current.onstop = () => {
//                     if (microphone.current) {

//                         // Cleanup event handlers
//                         microphone.current.onstart = null;
//                         microphone.current.onstop = null;
//                         microphone.current.ondataavailable = null;

//                         microphone.current = null

//                         console.log("client: microphone closed");
//                     }
//                 };

//                 microphone.current!.ondataavailable = (event: BlobEvent) => {
//                     if (event.data.size > 0 && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//                         console.log('sending to server')
//                         socketRef.current.send(event.data);
//                     }
//                 };

//                 try {
//                     microphone.current.start(1000);
//                 } catch (error) {
//                     reject(error);
//                 }
//             }
//         });
//     }

//     return (
//         <div className="h-screen bg-[#1C1C1C] text-white p-6">
//             {/* Header */}
//             {!loading ? <>
//                 <Link to='/' className="flex items-center gap-2 mb-8">
//                     <div className="bg-purple-600 p-1.5 rounded">
//                         <Users className="h-6 w-6 text-white" />
//                     </div>
//                     <span className="text-xl font-bold">Interview</span>
//                 </Link>

//                 <div className="flex flex-col md:flex-row gap-5 items-center justify-center px-20 py-10 h-full max-h-[calc(100vh-120px)]">
//                     {/* Main Content */}
//                     <div className="w-[75%]">
//                         {/* Video Area */}
//                         <VideoCallView isJoined={isJoined} microphone={microphone.current} changeMicrophoneState={changeMicrophoneState} />

//                     </div>

//                     {/* Join chat or chat screen */}
//                     <div className="w-[25%] flex flex-col items-center justify-center h-full">
//                         {!isJoined ?
//                             <JoinCall onClick={makeSocketConnection} loading={loading} />
//                             :
//                             <ChatScreen captions={captions} />
//                         }
//                     </div>
//                 </div>
//             </>
//                 : <div className='flex h-full items-center justify-center text-5xl'>Loading...</div>
//             }
//         </div>
//     )
// }

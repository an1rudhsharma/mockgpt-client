import { Mic, MicOff, Users, Video, VideoOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'


interface Captions { id: number, sender: string, text: string, timestamp: Date }
const messages: Captions[] = [
    {
        id: 1,
        sender: "Alex",
        text: "Hello Abhay, How was your day? Let's start with your backend interview",
        timestamp: new Date()
    },
]

export default function InterviewPage() {
    const { type } = useParams()
    console.log(type)

    const [isJoined, setIsJoined] = useState<boolean>(false);

    const socketRef = useRef<WebSocket | null>(null)
    const isPlayingRef = useRef<boolean>(false)
    const currentAudioSourceRef = useRef<any>(false)

    const [microphone, setMicrophone] = useState<MediaRecorder | null>(null)
    const [captions, setCaptions] = useState<Captions[]>(messages)
    const [loading, setLoading] = useState(false);

    const makeSocketConnection = () => {
        try {
            setLoading(true)
            console.log('backend url ', import.meta.env.VITE_WEBSOCKET_URL)
            const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioQueue: any = [];
            const transcript: any = [];

            socket.onopen = async () => {
                socketRef.current = socket;
                console.log("client: connected to server");
            };

            socket.addEventListener("message", async (message: any) => {
                if (message === "") {
                    return;
                }

                let data;
                try {
                    data = JSON.parse(message.data);
                    if (data == 'deepgram is active') {
                        changeActiveState();
                        setIsJoined(true)
                    }
                    if (data && data.event == 'playAudio') {
                        // Decode the incoming ArrayBuffer into an AudioBuffer
                        const payload = data.media.payload
                        audioQueue.push(payload);
                        playNextInQueue(audioContext, audioQueue, transcript)
                    }
                    else if (data && data.event == 'clear') {
                        audioQueue.length = 0
                        if (currentAudioSourceRef.current) {
                            currentAudioSourceRef.current.stop();
                            currentAudioSourceRef.current.disconnect();
                        }
                    }
                    else if (data.event == 'text') {
                        transcript.push(data.media.payload)
                    }
                } catch (e) {
                    console.error("Failed to parse JSON:", e);
                    return;
                }
            });

            socket.onclose = () => {
                console.log("client: disconnected from server");
            }
        } catch (error) {

        }
    }

    const changeActiveState = async () => {
        let microphoneObj;
        if (!microphone) {
            try {
                console.log("client: waiting to open microphone");
                microphoneObj = await getMicrophone();
                setMicrophone(microphoneObj)

                await openMicrophone(microphoneObj);
                setLoading(false)
                // setCaptions('Listening...')
            } catch (error) {
                console.error("error opening microphone:", error);
            }
        } else {
            await closeMicrophone();
            setMicrophone(null);
            // setCaptions('RealTime conversation')
        }
    }

    const base64ToArrayBuffer = (base64: any) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    const playNextInQueue = async (audioContext: any, audioQueue: any[], transcript: string[]) => {
        if (audioQueue.length === 0 || isPlayingRef.current) {
            return;
        };
        const audioData = audioQueue.shift();

        const transcriptText = transcript.shift() as string
        isPlayingRef.current = true

        try {
            const arrayBuffer = base64ToArrayBuffer(audioData);
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Create a new source and play the audio
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            setCaptions((prev) => [...prev, {
                id: Math.ceil(Math.random() * 1000),
                sender: "Alex",
                text: transcriptText,
                timestamp: new Date()
            },])
            source.connect(audioContext.destination);
            source.start();

            // if (currentAudioSource) {}
            currentAudioSourceRef.current = source;

            // When audio finishes, isPlaying is false and play the next audio
            source.onended = () => {
                // setIsPlaying(false);
                isPlayingRef.current = false
                playNextInQueue(audioContext, audioQueue, transcript);
            };
        } catch (error) {
            console.error("Error decoding or playing audio chunk:", error);
            // setIsPlaying(false);
            isPlayingRef.current = false
            playNextInQueue(audioContext, audioQueue, transcript); // Continue to the next in case of an error
        }
    };

    async function getMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return new MediaRecorder(stream, { mimeType: "audio/webm" });
        } catch (error) {
            console.error("error accessing microphone:", error);
            throw error;
        }
    }

    async function openMicrophone(microphone: MediaRecorder,) {
        return new Promise((resolve) => {
            microphone.onstart = () => {
                console.log("client: microphone opened");
                resolve(0);
            };

            microphone.onstop = () => {
                console.log("client: microphone closed");
            };

            microphone.ondataavailable = (event: any) => {
                // console.log("client: microphone data received");
                if (event.data.size > 0 && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(event.data);
                }
            };

            microphone.start(1000);
        });
    }

    async function closeMicrophone() {
        microphone!.stop();
    }


    return (
        <div className="h-screen bg-[#1C1C1C] text-white p-6">
            {/* Header */}
            {!loading ? <>
                <Link to='/' className="flex items-center gap-2 mb-8">
                    <div className="bg-purple-600 p-1.5 rounded">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold">Interview</span>
                </Link>

                <div className="flex flex-col md:flex-row gap-5 items-center justify-center px-20 py-10 h-full max-h-[calc(100vh-120px)]">
                    {/* Main Content */}
                    <div className="w-[75%]">
                        {/* Video Area */}
                        <VideoCallView isJoined={isJoined} microphone={microphone} />

                    </div>

                    {/* Join chat or chat screen */}
                    <div className="w-[25%] flex flex-col items-center justify-center h-full">
                        {!isJoined ?
                            <JoinCall onClick={makeSocketConnection} loading={loading} />
                            :
                            <ChatScreen captions={captions} />
                            // <ChatScreen />
                        }
                    </div>
                </div>
            </>
                : <div className='flex h-full items-center justify-center text-5xl'>Loading...</div>
            }
        </div>
    )
}


const VideoCallView: React.FC<{ isJoined: boolean, microphone: MediaRecorder | null }> = ({ isJoined, microphone }) => {
    const [isUserFullScreen, setIsUserFullScreen] = useState<boolean>(true);
    return (
        <div className="relative aspect-video max-h-[calc(100vh-200px)]">
            {isUserFullScreen ?
                <UserVideoScreen isUserFullScreen={isUserFullScreen} microphone={microphone} />
                :
                <SecondJoineeScreen />
            }

            {isJoined && <div
                onClick={() => { setIsUserFullScreen(!isUserFullScreen) }}
                className="absolute bottom-4 right-4 w-48 aspect-video cursor-pointer"
            >
                {isUserFullScreen ?
                    <SecondJoineeScreen />
                    :
                    <UserVideoScreen isUserFullScreen={isUserFullScreen} microphone={microphone} />
                }
            </div>}
        </div>
    )
}

const JoinCall: React.FC<{
    onClick: () => void,
    loading: boolean
}> = ({ onClick, loading }) => {
    return (
        <div className='flex flex-col items-center '>
            <h2 className="text-2xl font-semibold mb-6">Ready to join?</h2>
            <Avatar className="w-16 h-16 mb-4">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <p className="text-gray-400 mb-4">Rishabh is in the call</p>
            {loading ? <Button className="bg-purple-600 hover:bg-purple-700">
                Loading...
            </Button>
                :
                <Button onClick={onClick} className="bg-purple-600 hover:bg-purple-700">
                    Join Now
                </Button>
            }
        </div>)
}

const ChatScreen: React.FC<{ captions: Captions[] }> = ({ captions }) => {
    // const ChatScreen = () => {
    return (
        <Card className="w-80 rounded-lg overflow-hidden bg-white h-full">
            <div className="p-2 px-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Live Transcript</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="p-4 space-y-4">
                    {captions.map((message) => (
                        <div key={message.id} className="space-y-2">
                            <div className="text-sm text-gray-500">{message.sender}</div>
                            <div className={`p-3 rounded-lg max-w-[90%] ${message.sender === "Aaron"
                                ? "bg-purple-100 text-purple-900 ml-auto"
                                : "bg-gray-100 text-gray-900"
                                }`}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>)
}

const UserVideoScreen: React.FC<{ isUserFullScreen?: boolean, microphone: MediaRecorder | null }> = ({ isUserFullScreen, microphone }) => {
    const [isCameraOn, setIsCameraOn] = useState(false)
    // const [microphone, setMicrophone] = useState<MediaRecorder | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // const getMic = () => {
    //     setIsMicOn(!isMicOn)
    // }

    useEffect(() => {
        if (isCameraOn) {

            const constraints = {
                audio: false,
                video: true,
            };

            navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
                streamRef.current = mediaStream;
                const videoTracks = streamRef.current.getVideoTracks();
                console.log("Got stream with constraints:", constraints);
                console.log(`Using video device: ${videoTracks[0].label}`);
                streamRef.current.onremovetrack = () => {
                    console.log("Stream ended");
                };

                if (videoRef.current) {
                    console.log('kjsbdvkjkj')
                    videoRef.current.srcObject = streamRef.current;
                }
            }).catch((error) => {
                console.error(`getUserMedia error: ${error.name}`, error);
            })

        }
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null
            }
        };
    }, [isCameraOn])
    return (<div className='relative h-full bg-[#2C2C2C] rounded-lg flex items-center justify-center overflow-hidden'>

        {/* User 1 */}
        {isCameraOn ?
            <video ref={videoRef} className='absolute top-0 left-0 w-full h-full object-cover' autoPlay playsInline />
            :
            <div className={`${isUserFullScreen ? 'text-2xl' : 'text-md'} text-gray-400`}>Camera is off</div>}

        {isUserFullScreen && <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full flex gap-5">
            <Button
                variant={isCameraOn ? "ghost" : "destructive"}
                size="icon"
                className={isCameraOn ? 'border border-white' : ''}
                onClick={() => setIsCameraOn(!isCameraOn)}
            >
                {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button
                variant={microphone ? "ghost" : "destructive"}
                size="icon"
                className={microphone ? 'border border-white' : ''}
            // onClick={() => getMic()}
            >
                {microphone ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
        </div>}
    </div>)
}

const SecondJoineeScreen = () => {
    return (
        <div className='h-full w-full bg-[#1C1C1C] rounded-lg flex flex-col items-center justify-center gap-4 border border-gray-700'>
            <Avatar className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>R</AvatarFallback>
            </Avatar>

            <div className="text-sm font-medium">
                Rishabh
            </div>
        </div>
    )
}
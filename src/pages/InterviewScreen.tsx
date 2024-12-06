import { Mic, MicOff, Users, Video, VideoOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

const messages = [
    {
        id: 1,
        sender: "Alex",
        text: "Hey Aaron,thanks for joining me today. I'm Alex and I'll be conducting your interview. I'm excited to get started... Can you tell me a little bit about yourself?",
        timestamp: new Date()
    },
    {
        id: 2,
        sender: "Aaron",
        text: "Hey Alex, its nice to meet you! My name is Aaron,I studied computer science at Brown University.I'm really passionate about software engineering and particularly interested in data science related...",
        timestamp: new Date()
    },
    {
        id: 3,
        sender: "Alex",
        text: "That's great to hear, Aaron",
        timestamp: new Date()
    }
]

export default function InterviewPage() {
    const { type } = useParams()
    console.log(type)

    const [isJoined, setIsJoined] = useState<boolean>(false)

    return (
        <div className="h-screen bg-[#1C1C1C] text-white p-6">
            {/* Header */}
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
                    <VideoCallView isJoined={isJoined} />

                </div>

                {/* Join chat or chat screen */}
                <div className="w-[25%] flex flex-col items-center justify-center h-full">
                    {!isJoined ?
                        <JoinCall setIsJoined={setIsJoined} />
                        :
                        <ChatScreen />
                    }
                </div>
            </div>
        </div>
    )
}


const VideoCallView: React.FC<{ isJoined: boolean }> = ({ isJoined }) => {
    const [isUserFullScreen, setIsUserFullScreen] = useState<boolean>(true);
    return (
        <div className="relative aspect-video max-h-[calc(100vh-200px)]">
            {isUserFullScreen ?
                <UserVideoScreen isUserFullScreen={isUserFullScreen} />
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
                    <UserVideoScreen isUserFullScreen={isUserFullScreen} />
                }
            </div>}
        </div>
    )
}

const JoinCall: React.FC<{ setIsJoined: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsJoined }) => {
    return (
        <div className='flex flex-col items-center '>
            <h2 className="text-2xl font-semibold mb-6">Ready to join?</h2>
            <Avatar className="w-16 h-16 mb-4">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <p className="text-gray-400 mb-4">Rishabh is in the call</p>
            <Button onClick={() => setIsJoined(true)} className="bg-purple-600 hover:bg-purple-700">
                Join Now
            </Button>
        </div>)
}

const ChatScreen = () => {
    return (
        <Card className="w-80 rounded-lg overflow-hidden bg-white h-full">
            <div className="p-2 px-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Live Transcript</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="p-4 space-y-4">
                    {messages.map((message) => (
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

const UserVideoScreen: React.FC<{ isUserFullScreen?: boolean }> = ({ isUserFullScreen }) => {
    const [isCameraOn, setIsCameraOn] = useState(false)
    const [isMicOn, setIsMicOn] = useState(false)
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const getMic = () => {
        setIsMicOn(!isMicOn)
    }

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
                variant={isMicOn ? "ghost" : "destructive"}
                size="icon"
                className={isMicOn ? 'border border-white' : ''}
                onClick={() => getMic()}
            >
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
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
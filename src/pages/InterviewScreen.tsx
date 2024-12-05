import { Mic, MicOff, Users, Video, VideoOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function InterviewPage() {
    const { type } = useParams()
    console.log(type)

    const [isCameraOn, setIsCameraOn] = useState(true)
    const [isMicOn, setIsMicOn] = useState(true)

    const getMic = () => {
        setIsMicOn(!isMicOn)
    }

    return (
        <div className="h-screen bg-[#1C1C1C] text-white p-6">
            {/* Header */}
            <Link to='/' className="flex items-center gap-2 mb-8">
                <div className="bg-purple-600 p-1.5 rounded">
                    <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Interview</span>
            </Link>

            <div className="flex flex-col md:flex-row gap-5 items-center justify-center px-20 py-10">
                {/* Main Content */}
                <div className="w-[75%] ">
                    {/* <h1 className="text-center text-2xl font-semibold mb-6">
                        {type} Interview with Rishabh
                    </h1> */}

                    {/* Video Area */}
                    <div className="relative aspect-video max-h-[calc(100vh-200px)] bg-[#2C2C2C] rounded-lg flex items-center justify-center overflow-hidden">
                        {isCameraOn ? <VideoScreen /> : <div className="text-2xl text-gray-400">Camera is off</div>}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full flex gap-5">
                            <Button
                                variant={isCameraOn ? "ghost" : "destructive"}
                                size="icon"
                                onClick={() => setIsCameraOn(!isCameraOn)}
                            >
                                {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant={isMicOn ? "ghost" : "destructive"}
                                size="icon"
                                onClick={() => getMic()}
                            >
                                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Join Call */}
                <div className="w-[25%] flex flex-col items-center ">
                    <h2 className="text-2xl font-semibold mb-6">Ready to join?</h2>
                    <Avatar className="w-16 h-16 mb-4">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>R</AvatarFallback>
                    </Avatar>
                    <p className="text-gray-400 mb-4">Rishabh is in the call</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        Join Now
                    </Button>
                </div>
            </div>
        </div>
    )
}


const VideoScreen = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
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
                videoRef.current.srcObject = streamRef.current;
            }
        }).catch((error) => {
            console.error(`getUserMedia error: ${error.name}`, error);
        })

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null
            }
        };
    }, [])

    return (
        <video ref={videoRef} className='absolute top-0 left-0 w-full h-full object-cover' autoPlay playsInline />
    )
}

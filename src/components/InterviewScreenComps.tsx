import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Captions } from "@/interfaces/types";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

// VideoCall View
export const VideoCallView: React.FC<{ isJoined: boolean, isMicropohoneOn: boolean, changeMicrophoneState: () => void }> = ({ isJoined, isMicropohoneOn, changeMicrophoneState }) => {
    const [isUserFullScreen, setIsUserFullScreen] = useState<boolean>(true);
    return (
        <div className="relative w-full h-full">

            <div onClick={() => { if (!isUserFullScreen) setIsUserFullScreen(!isUserFullScreen); }} className={`${isUserFullScreen ? 'w-full h-full aspect-video max-h-[calc(100vh-200px)]' : 'absolute bottom-4 right-4 w-48 aspect-video cursor-pointer'}`}>
                <UserVideoScreen isUserFullScreen={isUserFullScreen} isMicropohoneOn={isMicropohoneOn} changeMicrophoneState={changeMicrophoneState} />
            </div>

            {isJoined &&
                <div
                    onClick={() => { if (isUserFullScreen) setIsUserFullScreen(!isUserFullScreen); }}
                    className={`${!isUserFullScreen ? 'w-full h-full aspect-video max-h-[calc(100vh-200px)]' : 'absolute bottom-4 right-4 w-48 aspect-video cursor-pointer'}`}
                >
                    <SecondJoineeScreen />
                </div>
            }
        </div>
    )
}

// Join Call Block
export const JoinCall: React.FC<{
    onClick: () => void,
    loading: boolean
}> = ({ onClick, loading }) => {
    return (
        <div className='flex flex-col items-center'>
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

// ChatScreen
export const ChatScreen: React.FC<{ captions: Captions[] }> = ({ captions }) => {
    console.log(captions)
    return (
        <Card className="w-80 rounded-lg overflow-hidden bg-white h-full">
            <div className="p-2 px-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Live Transcript</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="p-4 space-y-1">
                    {captions.map((message) => (
                        <div key={message.id} className="space-y-1">
                            <div className={`${message.sender === "user" ? 'ml-auto' : ''} w-fit text-sm text-gray-500`}>{message.sender}</div>
                            <div className={`p-3 rounded-lg max-w-[90%] ${message.sender === "user"
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

// User video screen
const UserVideoScreen: React.FC<{ isUserFullScreen?: boolean, isMicropohoneOn: boolean, changeMicrophoneState: () => void }> = ({ isUserFullScreen, isMicropohoneOn, changeMicrophoneState }) => {
    const [isCameraOn, setIsCameraOn] = useState(false)
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

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
                variant={isMicropohoneOn ? "ghost" : "destructive"}
                size="icon"
                className={isMicropohoneOn ? 'border border-white' : ''}
                onClick={() => changeMicrophoneState()}
            >
                {isMicropohoneOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
        </div>}
    </div>)
}

// Interviewer Video Screen
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
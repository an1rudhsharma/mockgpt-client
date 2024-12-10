import { Users } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWebSocket } from '@/hooks/useSocket'
import { useMicrophone } from '@/hooks/useMicrophone'
import { JoinCall, UserVideoScreen, VideoCallView, VideoScreenButtons } from '@/components/InterviewScreenComps'
import useVideoScreen from '@/hooks/useVideoCamera'

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

    const { cameraLoading, isCameraOn, setCameraLoading, setIsCameraOn } = useVideoScreen()

    useEffect(() => {
        console.log('Interview type:', type);
    }, [type]);

    return (
        <div className="h-screen bg-[#1C1C1C] text-white p-6">
            <Link to='/' className="flex items-center gap-2 mb-8">
                <div className="bg-purple-600 p-1.5 rounded">
                    <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Interview</span>
            </Link>
            <div className="h-full w-full px-20  max-h-[calc(100vh-120px)]">
                {!loading ? (
                    !isJoined ?
                        <div className='h-full w-full flex flex-col md:flex-row gap-5 items-center justify-center'>
                            <div className="relative w-full max-w-3xl bg-[#2C2C2C] rounded-lg overflow-hidden">
                                <UserVideoScreen isCameraOn={isCameraOn} cameraLoading={cameraLoading} setCameraLoading={setCameraLoading} />
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full flex gap-5">
                                    <VideoScreenButtons setIsCameraOn={setIsCameraOn} isMicropohoneOn={isMicropohoneOn} changeMicrophoneState={changeMicrophoneState} isCameraOn={isCameraOn} setCameraLoading={setCameraLoading} />
                                </div>
                            </div>

                            <div className="w-full max-w-xs flex flex-col items-center justify-center ">
                                <JoinCall
                                    onClick={makeSocketConnection}
                                    loading={loading}
                                />
                            </div>
                        </div>
                        :

                        <VideoCallView
                            socketRef={socketRef}
                            isMicropohoneOn={isMicropohoneOn}
                            changeMicrophoneState={changeMicrophoneState}
                            isCameraOn={isCameraOn}
                            cameraLoading={cameraLoading}
                            setCameraLoading={setCameraLoading}
                            setIsCameraOn={setIsCameraOn}
                            captions={captions}
                        />
                )
                    : (
                        <div className='flex h-full items-center justify-center text-5xl'>
                            Loading...
                        </div>
                    )}
            </div>
        </div>
    );
}
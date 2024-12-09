import { Users } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWebSocket } from '@/hooks/useSocket'
import { useMicrophone } from '@/hooks/useMicrophone'
import { ChatScreen, JoinCall, UserVideoScreen, VideoCallView } from '@/components/InterviewScreenComps'

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
            <Link to='/' className="flex items-center gap-2 mb-8">
                <div className="bg-purple-600 p-1.5 rounded">
                    <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Interview</span>
            </Link>
            <div className="h-full w-full px-20 py-10 max-h-[calc(100vh-120px)]">
                {!loading ? (
                    !isJoined ?
                        <div className='h-full w-full flex flex-col md:flex-row gap-5 items-center justify-center'>
                            <div className="w-full max-w-3xl">
                                <UserVideoScreen isMicropohoneOn={isMicropohoneOn} changeMicrophoneState={changeMicrophoneState} />
                            </div>

                            <div className="w-full max-w-xs flex flex-col items-center justify-center ">
                                <JoinCall
                                    onClick={makeSocketConnection}
                                    loading={loading}
                                />
                            </div>
                        </div>
                        :
                        <div className='h-full w-full flex flex-col md:flex-row gap-5 items-center justify-center'>
                            <div className="w-full max-w-4xl">
                                <VideoCallView
                                    isMicropohoneOn={isMicropohoneOn}
                                    changeMicrophoneState={changeMicrophoneState}
                                />
                            </div>
                            <div className="w-full max-w-xs flex flex-col items-center justify-center">
                                <ChatScreen captions={captions} /> </div></div>)
                    : (
                        <div className='flex h-full items-center justify-center text-5xl'>
                            Loading...
                        </div>
                    )}
            </div>
        </div>
    );
}
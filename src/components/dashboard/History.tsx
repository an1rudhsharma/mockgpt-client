import { useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

interface Interview {
    id: string
    candidateName: string
    position: string
    date: string
    duration: string
    score: number
}

const interviews: Interview[] = [
    { id: "1", candidateName: "Aaron Wang", position: "Developer Intern", date: "Mar 5, 2024", duration: "9m 25s", score: 77 },
    { id: "2", candidateName: "Emily Johnson", position: "Frontend Developer", date: "Mar 3, 2024", duration: "15m 10s", score: 85 },
    { id: "3", candidateName: "Michael Brown", position: "Data Scientist", date: "Feb 28, 2024", duration: "12m 45s", score: 92 },
    { id: "4", candidateName: "Sarah Lee", position: "UX Designer", date: "Feb 25, 2024", duration: "11m 30s", score: 88 },
    { id: "5", candidateName: "David Chen", position: "Backend Developer", date: "Feb 20, 2024", duration: "14m 15s", score: 79 },
]


const DashboardHistory = () => {
    const navigate = useNavigate()
    return (
        <div className="text-white">
            <div className="p-6">
                <h2 className="text-3xl font-semibold mb-4">Recent Interviews</h2>
                <div className="space-y-4">
                    {interviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="flex items-center justify-between p-4  rounded-lg shadow hover:bg-neutral-900 transition cursor-pointer bg-[#2C2C2C] border-[#3D3D3D] text-white"
                            onClick={() => navigate(`/dashboard/review/${interview.id}`)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#3D3D3D] border-[#3D3D3D] text-white rounded-full flex items-center justify-center">
                                    {interview.candidateName.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-medium">{interview.candidateName}</div>
                                    <div className="text-sm text-gray-500">{interview.position}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-sm text-gray-500">{interview.date}</div>
                                <div className="text-sm text-gray-500">{interview.duration}</div>
                                <div className="font-medium">Score: {interview.score}</div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardHistory

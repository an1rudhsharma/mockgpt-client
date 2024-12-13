import { Users, Database, LayoutDashboard, LineChart, FileSpreadsheet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/card'
const interviewCards = [
    { icon: <Database className="h-12 w-12" />, label: "Backend", to: 'backend-development-interview' },
    { icon: <LayoutDashboard className="h-12 w-12" />, label: "Frontend", to: 'frontend-development-interview' },
    { icon: <Users className="h-12 w-12" />, label: "Product Management", to: 'product-management-interview' },
    { icon: <LineChart className="h-12 w-12" />, label: "Data Science", to: 'datra-science-interview' },
    { icon: <FileSpreadsheet className="h-12 w-12" />, label: "Analytics", to: 'data-analytics-interview' },
]

const DashboardInterview = () => {
    return (
        <>
            <h1 className="text-3xl font-bold mb-2 text-center">1:1 interview with instant feedback using AI</h1>
            <p className="text-xl text-gray-400 mb-12 text-center">Choose your desired profile</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                {interviewCards.map((item, index) => (
                    <Link key={index} to={`/interview/${item.to}`} >
                        <Card className="bg-[#2C2C2C] text-white border-0 p-6 flex flex-col items-center gap-4 hover:bg-[#3C3C3C] cursor-pointer transition-colors">
                            {item.icon}
                            <h2 className="font-medium text-center">{item.label}</h2>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default DashboardInterview

import { Database, Home, History, LayoutDashboard, Users, LineChart, FileSpreadsheet } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from 'react-router-dom'

const interviewCards = [
    { icon: <Database className="h-12 w-12" />, label: "Backend", to: 'backend-development-interview' },
    { icon: <LayoutDashboard className="h-12 w-12" />, label: "Frontend", to: 'frontend-development-interview' },
    { icon: <Users className="h-12 w-12" />, label: "Product Management", to: 'product-management-interview' },
    { icon: <LineChart className="h-12 w-12" />, label: "Data Science", to: 'datra-science-interview' },
    { icon: <FileSpreadsheet className="h-12 w-12" />, label: "Analytics", to: 'data-analytics-interview' },
]

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-[#1C1C1C] text-white">
            <aside className="w-64 bg-[#121212] p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-purple-600 p-1.5 rounded">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold">Interview</span>
                </div>
                <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#2C2C2C]">
                        <Home className="h-5 w-5 mr-3" />
                        Home
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#2C2C2C]">
                        <History className="h-5 w-5 mr-3" />
                        History
                    </Button>
                </nav>
            </aside>
            <main className="flex-1 p-8 pt-10 lg:pt-20">
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
            </main>
        </div>
    )
}


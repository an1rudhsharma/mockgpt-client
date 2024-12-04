import { Database, Home, History, LayoutDashboard, Users, LineChart, FileSpreadsheet } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-2 text-center">1:1 interview with instant feedback using AI</h1>
                <p className="text-xl text-gray-400 mb-12 text-center">Choose your desired profile</p>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
                    {[
                        { icon: <Database className="h-12 w-12" />, label: "Backend" },
                        { icon: <LayoutDashboard className="h-12 w-12" />, label: "Frontend" },
                        { icon: <Users className="h-12 w-12" />, label: "Product Management" },
                        { icon: <LineChart className="h-12 w-12" />, label: "Data Science" },
                        { icon: <FileSpreadsheet className="h-12 w-12" />, label: "Analytics" },
                    ].map((item, index) => (
                        <Card key={index} className="bg-[#2C2C2C] border-0 p-6 flex flex-col items-center gap-4 hover:bg-[#3C3C3C] cursor-pointer transition-colors">
                            {item.icon}
                            <h2 className="font-medium text-center">{item.label}</h2>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}


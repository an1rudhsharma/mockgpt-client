import { Button } from "@/components/ui/button"
import { MoonIcon, Search, Users } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white relative">
            {/* Grid Background */}
            <div
                className="absolute inset-0 bg-[linear-gradient(rgba(10,10,10,0.8),rgba(10,10,10,0.8))]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h98v98H1V1z' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Content */}
            <div className="relative ">
                {/* Navigation */}
                <nav className="border-b border-gray-800 bg-[#0A0A0A]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link to='/' className="flex items-center gap-2">
                                <div className="bg-purple-600 p-1.5 rounded">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold">Interview</span>
                            </Link>

                            {/* Navigation Links */}
                            <div className="hidden md:flex items-center gap-8">
                                <Link to="#" className="text-gray-300 hover:text-white">
                                    Explore Interviews
                                </Link>
                                <Link to="#" className="text-gray-300 hover:text-white">
                                    Mock Interviews
                                </Link>
                                <Link to="#" className="text-gray-300 hover:text-white">
                                    For Job seekers
                                </Link>
                                <Link to="#" className="text-gray-300 hover:text-white">
                                    Pricing
                                </Link>
                                <Link to="#" className="text-gray-300 hover:text-white">
                                    FAQs
                                </Link>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon">
                                    <Search className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MoonIcon className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="hidden md:inline-flex"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    className="bg-white text-black hover:bg-gray-200"
                                    onClick={() => navigate('/signup')}
                                >
                                    Get started
                                </Button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center">
                    {/* New Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#1C1C1C] rounded-full px-2 py-2 mb-8">
                        <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                            New
                        </span>
                        <span className="text-sm text-gray-300">
                            Create custom interviews is out now!
                        </span>
                    </div>

                    {/* Hero Title */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        AI-based video interview and{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700">
                            hiring software
                        </span>
                    </h1>

                    {/* Hero Subtitle */}
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12">
                        Increase your hiring team's efficiency with a combination of resume scoring, skills
                        assessment, and asynchronous video interviews led with AI.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6"
                            onClick={() => navigate('/signup')}
                        >
                            Start free trial →
                        </Button>
                        <Button variant="outline" className="text-lg px-8 py-6 text-black">
                            Book a demo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


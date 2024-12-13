import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
// import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, BriefcaseBusiness, CalendarDays, Timer, ShieldCheck, Download } from 'lucide-react'
import { useState } from "react"
// import { Input } from "../ui/input"

interface SkillCard {
    type: string
    category: string
    score: number
    feedback: string
}

export default function ReviewPage() {
    const [isQuestionSummaryOpen, setIsQuestionSummaryOpen] = useState(false)
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
    const [isVideoOpen, setIsVideoOpen] = useState(false)

    const skillCards: SkillCard[] = [
        {
            type: "Technical Skill",
            category: "Python",
            score: 75,
            feedback: "Aaron demonstrated a basic understanding of Python data structures by correctly identifying the mutability of lists and the immutability of tuples. He also correctly mentioned that tuples can be used as dictionary keys while lists cannot. However, his explanation lacked depth, as he did not elaborate on the concept of immutability or provide additional details about the characteristics and use cases of tuples and lists."
        },
        {
            type: "Technical Skill",
            category: "DSA",
            score: 80,
            feedback: "Aaron demonstrated a basic understanding of Python data structures by correctly identifying the mutability of lists and the immutability of tuples. He also correctly mentioned that tuples can be used as dictionary keys while lists cannot. However, his explanation lacked depth, as he did not elaborate on the concept of immutability or provide additional details about the characteristics and use cases of tuples and lists."
        },
        {
            type: "Soft Skill",
            category: "Communication",
            score: 70,
            feedback: "Aaron communicated his points clearly when discussing technical topics and was able to articulate his thought process during the problem-solving question. However, his attempt to deflect a question with humor ('Could you tell me and then give me a one hundred on the interview?') was inappropriate for an interview setting and detracted from his overall communication score. Additionally, he could have asked more clarifying questions or engaged in a more in-depth discussion on the technical topics."
        },
        {
            type: "Technical Skill",
            category: "Problem Solving",
            score: 85,
            feedback: "Aaron showed a good approach to problem-solving by outlining a method to test a hypothesis involving stock prices and CEO resignations. He mentioned collecting relevant data, conducting a t-test, and setting up a null and alternate hypothesis. His approach to ensuring the validity of the results, including checking the p-value, ensuring data cleanliness, cross-referencing data sources, and running regression analysis, indicates a strong understanding of statistical analysis and problem-solving skills."
        }
    ]

    return (
        <div className="min-h-screen w-full text-white">
            <div className="flex items-center justify-end px-6 py-4">
                <Button variant="outline" className="border-[#3D3D3D] text-black hover:bg-[#eee]">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                </Button>
            </div>
            <div className="container max-w-[70%] mx-auto py-8 px-4 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                            {/* Interview Report */}
                            <div className="space-y-4 flex-grow">
                                <h1 className="text-2xl font-semibold">Interview Report for <span className="text-purple-600">Aaron Wang</span></h1>
                                <div className="flex flex-col gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2 font-medium"><BriefcaseBusiness size={18} /> Developer Intern</div >
                                    <div className="flex items-center gap-2 font-medium"><CalendarDays size={18} /> Mar 5, 2024</div>
                                    <div className="flex items-center gap-2 font-medium"><Timer size={18} /> 9 minutes and 25 seconds</div>
                                    <div className="flex items-center gap-2 font-medium"><ShieldCheck size={18} /> No signs of unfairness detected</div>
                                </div>
                            </div>

                            {/* Overall Score */}
                            <Card className="p-6 text-center w-full lg:w-64 bg-[#2C2C2C] border-[#3D3D3D] text-white">
                                <h2 className="text-lg font-medium mb-4">Overall Hire Score</h2>
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <Progress
                                        value={77}
                                        className="h-32 w-32"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl font-bold">77</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Overall Feedback */}
                        <Card className="p-6 bg-[#2C2C2C] border-[#3D3D3D] text-white">
                            <h2 className="text-lg font-medium mb-4">Overall Feedback</h2>
                            <p className="text-gray-200">
                                Overall, Aaron has shown a decent grasp of Python and strong problem-solving abilities. His communication skills are generally clear, but there is room for improvement in professional conduct and depth of discussion. His technical knowledge and problem-solving approach are promising, but he should work on providing more detailed explanations and maintaining a professional demeanor throughout the interview process.
                            </p>
                        </Card>

                        {/* Skill Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {skillCards.map((skill, index) => (
                                <Card key={index} className="p-6 bg-[#2C2C2C] border-[#3D3D3D] text-white">
                                    <div className="space-y-4">
                                        <div className="text-sm text-gray-400">{skill.type}</div>
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-3xl font-medium ">{skill.category}</h3>
                                            <div className="relative w-16 h-16">
                                                <Progress
                                                    value={skill.score}
                                                    className="h-16 w-16 [&>div]:stroke-purple-600 [&>div]:stroke-[8]"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-bold">{skill.score}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium mb-2 text-gray-300">Feedback</div>
                                            <p className="text-sm text-gray-400">{skill.feedback}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Question Summary */}
                        <Card className="bg-[#2C2C2C] border-[#3D3D3D] text-white">
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => setIsQuestionSummaryOpen(!isQuestionSummaryOpen)}
                            >
                                <h2 className="text-lg font-semibold">Question Summary</h2>
                                {isQuestionSummaryOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            {isQuestionSummaryOpen && (
                                <div className="p-6 pt-0">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-200">This position is in-person, so you would come into the London office. Are you able to work in London?</p>
                                            <p className="text-gray-400">The candidate, Aaron, confirmed the ability to work in London, mentioning dual citizenship with the United States and the UK, indicating no legal barriers to employment in London.</p>
                                        </div>
                                        {/* <Separator /> */}
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-200">Python is an important technology for this role. Can you explain the differences between a tuple and a list in Python?</p>
                                            <p className="text-gray-400">Aaron understands that a tuple is immutable and a list is mutable, and provided an example of using a tuple as a dictionary key due to its immutability, which lists cannot be used for.</p>
                                        </div>
                                        {/* <Separator /> */}
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-200">Let's say you hypothesize that when the CEO of a public company resigns, the company's share price goes down. How would you go about testing your hypothesis?</p>
                                            <p className="text-gray-400">Aaron proposed collecting data on stock price changes post-CEO resignation, conducting a t-test to assess statistical significance, and ensuring data validity through methods like cross-referencing and regression analysis to control for other variables.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Transcript */}
                        <Card className="bg-[#2C2C2C] border-[#3D3D3D] text-white">
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                            >
                                <h2 className="text-lg font-semibold">Transcript</h2>
                                {isTranscriptOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            {isTranscriptOpen && (
                                <div className="p-4 pt-0 space-y-4">
                                    {/* Transcript content */}
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <div className="text-gray-400">[00:00] Interviewer</div>
                                            <p>Hey Aaron, thanks for joining me today! I'm Alex and I'll be conducting your interview. I'm excited to get started. Can you tell me a little bit about yourself?</p>
                                        </div>
                                        <div>
                                            <div className="text-gray-400">[00:10] Candidate</div>
                                            <p>Hey, Alex. Nice to meet you. My name is Aaron. I studied computer science at Brown University. I'm really passionate about software engineering, and all things data science related. So really excited to to, again, get started here.</p>
                                        </div>
                                        {/* Add more transcript items as needed */}
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Video Recording */}
                        <Card className="bg-[#2C2C2C] border-[#3D3D3D] text-white">
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => setIsVideoOpen(!isVideoOpen)}
                            >
                                <h2 className="text-lg font-semibold">Video Recording</h2>
                                {isVideoOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            {isVideoOpen && (
                                <div className="p-4 pt-0">
                                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        <video
                                            controls
                                            className="w-full h-full"
                                            poster="/placeholder.svg"
                                        >
                                            <source src="/interview-recording.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}


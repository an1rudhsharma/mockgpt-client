import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "@/layout/AuthLayout"
import { Input } from "@/components/ui/input"

function SignUpPage() {
    const [role, setRole] = useState<'recruiter' | 'jobseeker' | ''>('');
    const [signup, setSignup] = useState<boolean>(false);

    return (
        <>
            {!signup ? <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Sign up</h2>
                    <p className="text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>

                <RadioGroup
                    value={role}
                    onValueChange={(value: 'recruiter' | 'jobseeker' | '') => setRole(value)}
                    className="space-y-3"
                >
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="recruiter" id="recruiter" />
                        <Label htmlFor="recruiter">I'm Recruiter</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="jobseeker" id="jobseeker" />
                        <Label htmlFor="jobseeker">I'm Job Seeker</Label>
                    </div>
                </RadioGroup>

                <Button
                    className="w-full bg-black text-white hover:bg-gray-800"
                    onClick={() => setSignup(true)}
                    disabled={!role}
                >
                    Continue →
                </Button>
            </div> : <SignupForm setSignup={setSignup} role={role} />}
        </>
    )
}

export default AuthLayout()(SignUpPage);




function SignupForm({ role, setSignup }: { role: 'recruiter' | 'jobseeker' | '', setSignup: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(role)
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }


    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Sign up</h2>
                <p className="text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                />
            </div>

            <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
            />

            <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />

            <Input
                name="confirmPassword"
                type="password"
                placeholder="Re Enter Password"
                value={formData.confirmPassword}
                onChange={handleChange}
            />

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSignup(false)}
                >
                    Back
                </Button>
                <Button className="flex-1 bg-black text-white hover:bg-gray-800">
                    Continue →
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
            </div>

            <Button variant="outline" className="w-full">
                <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
            </Button>
        </div>
    )
}


import { createContext, useContext, useState } from "react";

interface User {
    name: string,
    email: string,
    password: string
}

interface AuthContextType {
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context == null) {
        throw new Error('User must be logged In')
    }
    return context
}
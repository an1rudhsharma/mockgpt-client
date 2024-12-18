export interface Captions { id: number, sender: string, text: string, timestamp: Date }

export interface User {
    name: string,
    email: string,
    password: string
}

export type InterviewSubject = 'backend' | 'frontend' | 'analytics' | 'data-science' | 'product'


export interface Review {
    "overall": {
        "feedback": string,
        "score": number
    },
    "question_summary": {
        "question1": string,
        "answer1": string,
        "question2": string,
        "answer2": string
    },
    "skills": {
        "problem_solving": {
            "score": number,
            "details": string
        },
        "communication": {
            "score": number,
            "details": string
        }
    }
}
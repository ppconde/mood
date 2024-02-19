'use client'

import { askQuestion } from "@/utils/api";
import { useState } from "react"

const Question = () => {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(''); // [response, setResponse
    const onChange = (e) => {
        setQuestion(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const answer = await askQuestion(question);
        setResponse(answer);
        setQuestion('');
        setLoading(false);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input className="border border-black/20 px-4 py-2 text-lg rounded-lg"
                    type="text"
                    placeholder="Ask a question"
                    disabled={loading}
                    value={question}
                    onChange={onChange}
                />
                <button className="bg-blue-400 px-4 py-2 rounded-lg text-lg"
                    type="submit"
                    disabled={loading}
                >
                    Ask
                </button>
                {loading && <div>Loading...</div>}
                {response && <div>{response}</div>}
            </form>
        </div>
    )
}

export default Question;
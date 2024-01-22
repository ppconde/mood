'use client'

import { useState } from "react"

const Question = () => {
    const [value, setValue] = useState('');
    const onChange = (e) => {
        //Do things
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //Do things
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input className="border border-black/20 px-4 py-2 text-lg rounded-lg" type="text" placeholder="Ask a question" onChange={onChange} />
                <button className="bg-blue-400 px-4 py-2 rounded-lg text-lg" type="submit">Ask</button>
            </form>
        </div>
    )
}

export default Question;
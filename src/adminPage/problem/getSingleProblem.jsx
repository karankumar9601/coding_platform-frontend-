import { useNavigate, useParams } from "react-router"
import axiosClient from "../../utils/axios"
import { useEffect, useState } from "react"
export default function GetSingleProblem() {


    const [problems, setProblems] = useState({})
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const navigate = useNavigate()
    const fetchProblem = async (id) => {
        try {
            const res = await axiosClient.get(`/problem/${id}`)
            if (res.data.success) {
                setProblems(res.data.data)
            }
        } catch (error) {
            console.log(error.response?.data);
            alert("something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProblem(id)
    }, [id])
    return (
        <div className="h-screen bg-base-200 flex">
            {/* Left Panel */}
            <div className="w-1/2 h-screen overflow-y-auto bg-base-100 border-r border-base-300 p-6">
                <h1 className="text-2xl font-bold mb-3">{problems?.title}</h1>
                <div className="flex gap-2 mb-5">
                    <span className="badge badge-success badge-outline">{problems?.difficulty}</span>
                    <span className="badge badge-info badge-outline">{problems?.tag}</span>
                </div>
                <p className="text-base leading-7 whitespace-pre-line mb-6">{problems?.description}</p>
                <div className="space-y-5">
                    {problems?.visibleTestCase?.map((value, index) => (
                        <div key={index}>
                            <h3 className="font-semibold mb-2">Example {index + 1}:</h3>
                            <div className="bg-base-200 rounded-lg p-4 font-mono text-sm">
                                <p><span className="font-bold">Input:</span>{" "}{value?.input}</p>
                                <p><span className="font-bold">Output:</span>{" "}{value?.output}</p>
                                <p><span className="font-bold">Explanation:</span>{" "}{value?.Explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-1/2 h-screen flex flex-col bg-base-100">
                {/* Tabs */}
                <div className="tabs tabs-bordered px-4 pt-3 bg-base-100">
                    <input type="radio"name="code_tabs"className="tab"aria-label="Code"defaultChecked/>
                    <div className="tab-content border-base-300 bg-base-100 p-0">
                        <div className="h-[calc(100vh-120px)] overflow-y-auto p-4 space-y-6">
                            {problems?.startCode?.map((value, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold mb-2"> {value?.language}</h3>
                                    </div>

                                    <div className="mockup-code bg-neutral text-neutral-content rounded-lg">
                                        <pre>
                                            <code>{value?.initialCode}</code>
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <input type="radio"name="code_tabs"className="tab"aria-label="Solution"/>
                    <div className="tab-content border-base-300 bg-base-100 p-0">
                        <div className="h-[calc(100vh-120px)] overflow-y-auto p-4 space-y-6">
                            {problems?.referenceSolution?.map((value, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold mb-2">{value?.language}</h3>
                                    <div className="mockup-code bg-neutral text-neutral-content rounded-lg">
                                        <pre><code>{value?.completeCode}</code></pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
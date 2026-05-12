import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import { useParams } from "react-router";

export default function CodeEditor() {
    const [problem, setProblem] = useState(null);
    const [activeTab, setActiveTab] = useState("description");
    const [language, setLanguage] = useState("java");
    const [code, setCode] = useState("");
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    const tabs = ["description", "editorial", "solutions", "submissions"];

    const fetchProblem = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get(`/problem/${id}`);
            if (res.data.success) {
                const problemData = res.data.data;
                setProblem(problemData);
                const starterCode = problemData?.startCode?.find((item) => item.language === language)?.initialCode || "";
                setCode(starterCode);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblem();
    }, [id]);

    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        const starterCode = problem?.startCode?.find((item) => item.language === selectedLanguage)?.initialCode || "";
        setCode(starterCode);
    };

    const handleRunCode = async () => {
        try {
            const res = await axiosClient.post(`/user/run/${id}`, { code, language, });
            const results = res.data.data;
            const allAccepted = results.every((item) => item.status?.description === "Accepted");
            setTestResult({
                status: allAccepted ? "Accepted" : "Wrong Answer",
                results,
            });
        } catch (error) {
            console.log(error.response?.data || error.message);
            setTestResult({
                status: "Error",
                results: [
                    {
                        stderr: error.response?.data?.message || "Something went wrong",
                    },
                ],
            });
        }
    };

    const handleSubmitCode = async () => {
        try {
            const res = await axiosClient.post(`/user/submit/${id}`, {
                code,
                language,
            });

            setTestResult({
                status: res.data.status,
                output: res.data.message,
                passed: res.data.testCasePassed,
                total: res.data.totalTestCase,
                runtime: res.data.runtime,
                memory: res.data.memory,
                error: res.data.errorMessage,
            });
        } catch (error) {
            setTestResult({
                status: "error",
                output: error.response?.data?.message || "Submission failed",
            });
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#1e1e1e] text-white flex justify-center items-center">
                Loading...
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="h-screen bg-[#1e1e1e] text-white flex justify-center items-center">
                Problem not found
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#1e1e1e] text-white grid grid-cols-1 lg:grid-cols-2 gap-2 p-2">
            {/* LEFT SIDE */}
            <div className="bg-[#252525] rounded-lg border border-gray-700 overflow-hidden flex flex-col">
                <div className="flex gap-4 px-4 py-3 border-b border-gray-700 bg-[#2d2d2d]">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`capitalize text-sm font-medium ${activeTab === tab
                                ? "text-white border-b-2 border-blue-500"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-5 overflow-y-auto">
                    {activeTab === "description" && (
                        <div>
                            <h1 className="text-2xl font-bold">{problem?.title}</h1>

                            <div>
                                <span className="inline-block mt-5 px-3 py-1 rounded-full bg-gray-700 text-cyan-400 text-sm">
                                    {problem?.difficulty}
                                </span>

                                <span className="inline-block mt-5 ml-4 px-3 py-1 rounded-full bg-green-700 text-white text-sm">
                                    {problem?.tag}
                                </span>
                            </div>

                            <p className="mt-6 leading-7">{problem?.description}</p>

                            <div className="mt-8 space-y-6">
                                {problem?.visibleTestCase?.map((example, index) => (
                                    <div key={example?._id || index}>
                                        <h3 className="font-bold mb-3">Example {index + 1}:</h3>

                                        <div className="border-l-2 border-gray-600 pl-4 text-gray-300">
                                            <p>
                                                <b className="text-white">Input:</b>
                                            </p>
                                            <pre className="bg-[#333] p-3 rounded mt-2 whitespace-pre-wrap">
                                                {example?.input}
                                            </pre>

                                            <p className="mt-3">
                                                <b className="text-white">Output:</b>
                                            </p>
                                            <pre className="bg-[#333] p-3 rounded mt-2 whitespace-pre-wrap">
                                                {example?.output}
                                            </pre>

                                            {example?.Explanation && (
                                                <p className="mt-3">
                                                    <b className="text-white">Explanation:</b>{" "}
                                                    {example?.Explanation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "editorial" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Editorial</h2>
                            <p className="leading-7 text-gray-300">
                                {problem?.editorial || "Editorial not available"}
                            </p>
                        </div>
                    )}

                    {activeTab === "solutions" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Solution</h2>

                            {problem?.referenceSolution?.map((value, index) => (
                                <div key={value?._id || index} className="mb-6">
                                    <h3 className="text-white font-bold text-xl mb-3">
                                        {value?.language}
                                    </h3>

                                    <pre className="bg-black rounded-lg p-4 overflow-x-auto text-sm text-gray-300 whitespace-pre-wrap">
                                        {value?.completeCode}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "submissions" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Submissions</h2>

                            {/* API REPLACE HERE:
                  Recent submissions API
                  Example backend: GET /api/submission/problem/:problemId
                  You can fetch submissions here using useEffect when activeTab === "submissions"
              */}

                            <div className="bg-[#333] rounded-lg p-4">
                                <p>Status: Accepted</p>
                                <p>Language: Java</p>
                                <p>Runtime: 2 ms</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-2">
                <div className="bg-[#252525] rounded-lg border border-gray-700 overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3 bg-[#2d2d2d] border-b border-gray-700">
                        <h2 className="font-bold text-green-400">{"</>"} Code</h2>

                        <div className="flex gap-2 items-center">
                            <select value={language} onChange={handleLanguageChange} className="bg-[#1e1e1e] border border-gray-600 rounded px-3 py-1 text-sm">
                                {problem?.startCode?.map((item) => (
                                    <option key={item?._id} value={item?.language}>{item?.language}</option>
                                ))
                                }
                            </select>

                            <button onClick={handleRunCode} className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm">Run Code </button>
                            <button onClick={handleSubmitCode} className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm">Submit</button>
                        </div>
                    </div>

                    <Editor height="420px" theme="vs-dark" language={language} value={code} onChange={(value) => setCode(value || "")} />
                </div>

                <div className="bg-[#252525] rounded-lg border border-gray-700 flex-1 overflow-hidden">
                    <div className="flex gap-4 px-4 py-3 bg-[#2d2d2d] border-b border-gray-700">
                        <button className="font-bold text-white">Testcase</button>
                        <button className="text-gray-400">Test Result</button>
                    </div>

                    <div className="p-5 overflow-y-auto">
                        {problem?.visibleTestCase?.map((test, index) => (
                            <div key={test?._id || index} className="mb-5">
                                <p className="text-gray-400 mb-2">Case {index + 1}</p>
                                <div className="bg-[#3a3a3a] rounded-lg p-4">
                                    <pre className="whitespace-pre-wrap">{test?.input}</pre>
                                </div>
                            </div>
                        ))}

                        {testResult && (
                            <div className="mt-6 bg-[#333] rounded-lg p-4">
                                <p className="text-lg font-bold mb-3">
                                    Status:{" "}
                                    <span
                                        className={
                                            testResult.status === "accepted"
                                                ? "text-green-400"
                                                : testResult.status === "wrong"
                                                    ? "text-red-400"
                                                    : "text-yellow-400"
                                        }
                                    >
                                        {testResult.status}
                                    </span>
                                </p>

                                <p>
                                    <b>Message:</b> {testResult.message}
                                </p>

                                {testResult.total !== undefined && (
                                    <p>
                                        <b>Testcases:</b> {testResult.passed}/{testResult.total}
                                    </p>
                                )}

                                {testResult.runtime !== undefined && (
                                    <p>
                                        <b>Runtime:</b> {testResult.runtime}s
                                    </p>
                                )}

                                {testResult.memory !== undefined && (
                                    <p>
                                        <b>Memory:</b> {testResult.memory} KB
                                    </p>
                                )}

                                {testResult.error && (
                                    <pre className="mt-3 bg-black p-3 rounded text-red-400 whitespace-pre-wrap">
                                        {testResult.error}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
import axiosClient from "../utils/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function SubmissionPage() {
    const [problems, setProblems] = useState([]);
    const [user, setUser] = useState({});
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const limit = 10;

    const getSolvedProblems = async () => {
        try {
            const res = await axiosClient.get(`/user/solvedProblemByUser?page=${page}&limit=${limit}`);
            if (res.data.success) {
                setUser(res.data.data);
                setProblems(res.data.data.problemSolved || []);
                setTotalPage(res.data.totalPage);
            } else {
                alert(res.data.message)
            }

        } catch (error) {
            alert(error.response?.data?.message || "Failed to fetch submission Record");
        }
    };

    useEffect(() => {
        getSolvedProblems();
    }, [page]);

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white px-6 py-8">
            <h1 className="text-3xl font-bold text-slate-300 mb-2">Practice History </h1>
            <p className="text-white text-bold mb-6">{user?.firstName} {user?.lastName} • Total Solved: {problems.length}</p>
            <div className="bg-[#242424] border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#2b2b2b] text-slate-300">
                        <tr>
                            <th className="px-6 py-4">S.No.</th>
                            <th className="px-6 py-4">Problem</th>
                            <th className="px-6 py-4">Difficulty</th>
                            <th className="px-6 py-4">Tag</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {problems.length > 0 ? (
                            problems.map((problem, index) => (
                                <tr key={problem._id} className="border-t border-slate-700 hover:bg-[#303030] transition">
                                    <td className="px-6 py-4 text-slate-300">{(page - 1) * limit + index + 1}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/code-Editor/${problem._id}`} className="font-semibold text-white hover:text-cyan-400">{problem.title}</Link>
                                    </td>
                                    <td
                                        className={`px-6 py-4 font-semibold capitalize ${problem.difficulty === "easy" ? "text-cyan-400" : problem.difficulty === "medium" ? "text-yellow-400" : "text-red-400"}`}
                                    >
                                        {problem.difficulty}
                                    </td>
                                    <td className="px-6 py-4 capitalize text-slate-300"> {problem.tag}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm">Solved</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-slate-400">
                                    No solved problems found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center gap-3 mt-8">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-[#2b2b2b] rounded-lg disabled:opacity-40">
                    Prev
                </button>
                <span className="px-4 py-2 bg-slate-600 rounded-lg">{page} / {totalPage}</span>
                <button disabled={page === totalPage} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-[#2b2b2b] rounded-lg disabled:opacity-40">
                    Next
                </button>
            </div>
        </div>
    );
}
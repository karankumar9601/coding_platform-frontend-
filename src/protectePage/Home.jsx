import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import { CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../store/auth_slice";

const HomePage = () => {
    const [problems, setProblems] = useState([]);
    const [solvedIds, setSolvedIds] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [status, setStatus] = useState("all");
    const [difficulty, setDifficulty] = useState("all");
    const [tag, setTag] = useState("all");
    const [search, setSearch] = useState("");

    const { user, isAuthenticate } = useSelector(state => state.auth)
    const dispatch = useDispatch()
      
    const uniqueTags = [...new Set(problems.map((problem) => problem.tag))];

    const uniqueDifficulties = [...new Set(problems.map((problem) => problem.difficulty)),];

    const fetchProblems = async () => {
        try {
            const res = await axiosClient.get(`/problem/?page=${page}&limit=10`);
            setProblems(res.data.data);
            setTotalPage(res.data.totalPage);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSolvedProblems = async () => {
        try {
            const res = await axiosClient.get("/user/solvedProblemByUser");
            const solvedProblems = res.data.data.problemSolved;
            const ids = solvedProblems.map((problem) => problem._id);
            setSolvedIds(ids);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, [page]);

    useEffect(() => {
        fetchSolvedProblems();
    }, []);

    const handleLogout = async () => {
        dispatch(LogoutUser())
    }

    // filtering
    const filteredProblems = problems.filter((problem) => {
        const isSolved = solvedIds.includes(problem._id);
        // status filter
        if (status === "solved" && !isSolved) {
            return false;
        }
        if (status === "unsolved" && isSolved) {
            return false;
        }
        // difficulty filter
        if (difficulty !== "all" && problem.difficulty !== difficulty) {
            return false;
        }
        // tag filter
        if (tag !== "all" && problem.tag !== tag) {
            return false;
        }
        // search filter
        if (!problem.title.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Navbar */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                {/* Project Name */}
                <h1 className="text-2xl font-bold text-cyan-400">AlgoForge</h1>
                {/* User + Logout */}
                <div className="flex items-center gap-4">
                    <div className="bg-slate-800 px-4 py-2 rounded-lg">
                        {user.data?.firstName}
                    </div>
                    <button onClick={() => handleLogout()} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">Logout</button>

                </div>
            </div>

            <div className="p-6 max-w-6xl mx-auto">
                {/* Heading */}
                <h1 className="text-3xl font-bold mb-6">Problem Set </h1>
                {/* Filters */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <input type="text" placeholder="Search problem..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none" />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2">
                        <option value="all">All Status</option>
                        <option value="solved">Solved</option>
                        <option value="unsolved">Unsolved</option>
                    </select>

                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2">
                        <option value="all">All Difficulty</option>
                        {
                            uniqueDifficulties.map((item) => (<option key={item} value={item}>{item}</option>))
                        }

                    </select>

                    <select value={tag} onChange={(e) => setTag(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2">
                        <option value="all">All Tags</option>
                        {
                         uniqueTags.map(item=> <option key={item} value={item}>{item}</option>)   
                        }
                       
                    
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full bg-slate-900 rounded-xl overflow-hidden">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Title</th>
                                <th className="text-left px-6 py-4">Difficulty</th>
                                <th className="text-left px-6 py-4">Tag</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProblems.map((problem) => {
                                const isSolved = solvedIds.includes(problem._id);
                                return (
                                    <tr key={problem._id} className="border-t border-slate-800">
                                        <td className="px-6 py-4">{isSolved && (<CheckCircle className="text-green-400" size={20} />)}</td>
                                        <td className="px-6 py-4">{problem.title}</td>
                                        <td className="px-6 py-4 capitalize">{problem.difficulty}</td>
                                        <td className="px-6 py-4 capitalize">{problem.tag}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-4 mt-8">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)} className="bg-slate-800 px-4 py-2 rounded-lg disabled:opacity-40">Prev</button>
                    <p className="mt-2">{page} / {totalPage}</p>
                    <button disabled={page === totalPage} onClick={() => setPage(page + 1)} className="bg-slate-800 px-4 py-2 rounded-lg disabled:opacity-40">Next</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
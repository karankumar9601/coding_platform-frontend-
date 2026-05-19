import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import { CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../store/auth_slice";
import { Link, useNavigate } from "react-router";

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
    const navigate = useNavigate()

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
  <div className="min-h-screen bg-[#1a1a1a] text-white">
    {/* Navbar */}
    <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-cyan-400">AlgoForge</h1>

      <details className="dropdown dropdown-end">
        <summary className="btn bg-[#1a1a1a] hover:bg-[#252525] border border-[#2f2f2f] text-white rounded-xl px-4 transition">
          <span className="w-8 h-8 rounded-full bg-cyan-500 text-slate-900 flex items-center justify-center font-bold">
            {user?.data?.firstName?.charAt(0)?.toUpperCase()}
          </span>
          <span>{user?.data?.firstName}</span>
        </summary>

        <ul className="menu dropdown-content mt-3 bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl z-50 w-56 p-2 shadow-2xl text-gray-200">
          {user?.data?.role === "admin" && (
            <li>
              <Link
                to="/dashboard"
                className="hover:bg-[#252525] rounded-lg px-4 py-2"
              >
                Dashboard
              </Link>
            </li>
          )}

          <li>
            <Link
              to={`/profile/${user?.data?._id}`}
              className="hover:bg-[#252525] rounded-lg px-4 py-2"
            >
              Profile
            </Link>
          </li>

          <li>
            <Link
              to={`/submissions/${user?.data?._id}`}
              className="hover:bg-[#252525] rounded-lg px-4 py-2"
            >
              Submission
            </Link>
          </li>

          <div className="border-t border-[#2f2f2f] my-2"></div>

          <li>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:bg-red-500 hover:text-white rounded-lg px-4 py-2 transition text-left"
            >
              Logout
            </button>
          </li>
        </ul>
      </details>
    </div>

    {/* Main */}
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Problem Set</h1>
        <p className="text-slate-400 mt-2">
          Practice coding problems and improve your DSA skills
        </p>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search problem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option value="all">All Status</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option value="all">All Difficulty</option>
          {uniqueDifficulties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option value="all">All Tags</option>
          {uniqueTags.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#2a2a2a] rounded-2xl">
        <table className="w-full bg-[#1a1a1a] overflow-hidden">
          <thead className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
            <tr>
              <th className="text-left px-6 py-5">Status</th>
              <th className="text-left px-6 py-5">Title</th>
              <th className="text-left px-6 py-5">Difficulty</th>
              <th className="text-left px-6 py-5">Tag</th>
            </tr>
          </thead>

          <tbody>
            {filteredProblems.map((problem) => {
              const isSolved = solvedIds.includes(problem._id);

              return (
                <tr
                  key={problem._id}
                  className="border-t border-[#2a2a2a] hover:bg-[#232323] transition cursor-pointer"
                  onClick={() => navigate(`/code-Editor/${problem?._id}`)}
                >
                  <td className="px-6 py-5">
                    {isSolved && (
                      <CheckCircle className="text-green-400" size={20} />
                    )}
                  </td>

                  <td className="px-6 py-5 font-medium">{problem.title}</td>

                  <td className="px-6 py-5 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        problem.difficulty === "easy"
                          ? "bg-green-500/10 text-green-400"
                          : problem.difficulty === "medium"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>

                  <td className="px-6 py-5 capitalize">
                    <span className="bg-[#252525] px-3 py-1 rounded-full text-sm">
                      {problem.tag}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-[#252525] hover:bg-[#303030] px-5 py-2 rounded-xl disabled:opacity-40 transition"
        >
          Prev
        </button>

        <p className="bg-[#252525] px-5 py-2 rounded-xl">
          {page} / {totalPage}
        </p>

        <button
          disabled={page === totalPage}
          onClick={() => setPage(page + 1)}
          className="bg-[#252525] hover:bg-[#303030] px-5 py-2 rounded-xl disabled:opacity-40 transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
};

export default HomePage;
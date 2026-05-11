
import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../store/auth_slice";
export default function AdminDashboard() {

  const [show, setShow] = useState(false)
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [problems, setProblems] = useState([])
  const [totalProblem, setTotalProblem] = useState(" ")

  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    dispatch(LogoutUser())
  }

  const fetchProblems = async () => {
    try {
      const res = await axiosClient.get(`/problem/?page=${page}&limit=10`);
      setProblems(res.data.data);
      setTotalPage(res.data.totalPage);
      setTotalProblem(res.data.totalData)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProblems()
  }, [page])
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg sm:text-2xl font-bold text-cyan-400">
          AlgoForge Admin
        </h1>

        <div className="flex items-center gap-3">
          <h2 className="hidden sm:block">Karan</h2>
          <button onClick={() => handleLogout()} className="bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2 rounded-lg text-sm">
            Logout
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-900 md:min-h-screen border-r border-slate-800 p-4">
          <ul className="menu rounded-box w-full">
            <li>
              <a>Dashboard</a>
            </li>

            <li>
              <div onClick={() => setShow(!show)} className="cursor-pointer">
                Problem
              </div>

              {show && (
                <ul className="ml-4 mt-2">
                  <li>
                    <Link to="/addProblem">Add Problem</Link>
                  </li>
                  <li>
                    <Link to="/getSingleProblem">View Single Problem</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <a>Users</a>
            </li>
            <li>
              <a>Recent Submission</a>
            </li>
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Stats */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Dashboard Stats
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <p className="text-slate-400">Total Problems</p>
                <h3 className="text-3xl font-bold">40</h3>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <p className="text-slate-400">Total Users</p>
                <h3 className="text-3xl font-bold">40</h3>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <p className="text-slate-400">Recent Submissions</p>
                <h3 className="text-3xl font-bold">10</h3>
              </div>
            </div>
          </section>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto mt-8">
            <table className="w-full bg-slate-900 rounded-xl overflow-hidden">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left px-6 py-4">Title</th>
                  <th className="text-left px-6 py-4">Difficulty</th>
                  <th className="text-left px-6 py-4">Tag</th>
                  <th className="text-left px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {problems?.map((problem) => (
                  <tr key={problem._id} className="border-t border-slate-800">
                    <td className="px-6 py-4">{problem.title}</td>
                    <td className="px-6 py-4 capitalize">{problem.difficulty}</td>
                    <td className="px-6 py-4 capitalize">{problem.tag}</td>
                    <td className="px-6 py-4 flex gap-3">
                      <button className="bg-yellow-500 text-black px-3 py-1 rounded">Edit</button>
                      <button className="bg-red-500 px-3 py-1 rounded">Delete</button>
                      <button className="bg-blue-500 px-3 py-1 rounded">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden mt-8 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-lg font-bold">title</h3>
              <p className="text-slate-400 mt-1">Difficulty: difficulty</p>
              <p className="text-slate-400">Tag: tag</p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button className="bg-yellow-500 text-black px-3 py-1 rounded">Edit</button>
                <button className="bg-red-500 px-3 py-1 rounded">Delete</button>
                <button className="bg-blue-500 px-3 py-1 rounded">View</button>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 mt-6">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-slate-800 rounded disabled:opacity-50">Prev</button>
            <span>Page {page} of {totalPage}</span>
            <button disabled={page === totalPage} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-slate-800 rounded disabled:opacity-50">Next</button>
          </div>
        </main>
      </div>
    </div>
  );
}
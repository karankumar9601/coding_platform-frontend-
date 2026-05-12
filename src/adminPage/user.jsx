import { useEffect, useState } from "react"
import axiosClient from "../utils/axios";

export default function UserDetails() {
    const [user, setUsers] = useState([])
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const userDetails = async (req, res) => {
        try {
            const res = await axiosClient.get(`/api/allUser?page=${page}&limit=10`)
            if (res.data.success) {
                setUsers(res.data.data)
                setTotalPage(res.data.totalPage)
            }
        } catch (error) {
            console.log(error.res.data);
            alert("something went wrong")
        }
    }
    useEffect(() => {
        userDetails()
    }, [page])
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
  <div className="max-w-7xl mx-auto bg-[#1a1a1a] border border-[#2c2c2c] rounded-2xl overflow-hidden shadow-2xl">

    {/* Heading */}
    <div className="px-6 py-4 border-b border-[#2c2c2c]">
      <h1 className="text-2xl font-bold text-orange-500">User Leaderboard</h1>
      <p className="text-gray-400 text-sm mt-1">Track solved problems and user rankings</p>
    </div>
    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#262626] text-gray-300">
          <tr>
            <th className="px-6 py-4 text-left">S.No.</th>
            <th className="px-6 py-4 text-left">FirstName</th>
            <th className="px-6 py-4 text-left">LastName</th>
            <th className="px-6 py-4 text-left">EmailId</th>
            <th className="px-6 py-4 text-left">Role</th>
            <th className="px-6 py-4 text-left">Total Solved Problem</th>
          </tr>
        </thead>

        <tbody>
          {user?.map((value, index) => (
            <tr key={index}className="border-b border-[#2c2c2c] hover:bg-[#222222] transition duration-200" >
              <td className="px-6 py-4 text-gray-400">{index + 1}</td>
              <td className="px-6 py-4 font-medium text-white">{value?.firstName}</td>
              <td className="px-6 py-4 text-gray-300">{value?.lastName}</td>
              <td className="px-6 py-4 text-gray-400">{value?.emailId}</td>
              <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm">{value?.role}</span></td>
              <td className="px-6 py-4 text-green-400 font-semibold">{value?.problemSolvedCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="flex justify-center items-center gap-4 py-6 bg-[#181818]">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-5 py-2 rounded-lg bg-[#2c2c2c] hover:bg-[#3a3a3a] transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      <span className="text-gray-300 font-medium">
        Page <span className="text-orange-400">{page}</span> of{" "}
        <span className="text-orange-400">{totalPage}</span>
      </span>

      <button
        disabled={page === totalPage}
        onClick={() => setPage(page + 1)}
        className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</div>
    )
}
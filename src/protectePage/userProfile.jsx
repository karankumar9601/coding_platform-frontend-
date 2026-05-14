import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import axiosClient from "../utils/axios"

const profileData = z.object({
  firstName: z.string().min(3, "firstName should contain at least 3 characters"),
  lastName: z.string().min(3, "lastName should contain at least 3 characters"),
  emailId: z.string().email("Invalid Email"),
  age: z.coerce.number().min(8, "age should be greater than 8 years"),
});

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const[profile,setProfile]=useState({})

  const [loading, setLoading] = useState(false);

  const {register,handleSubmit,reset,watch,formState: { errors },} = useForm({resolver: zodResolver(profileData),});
  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/api/userProfile/${id}`);
      
      if (res.data.success) {
         reset(res.data.data);
         setProfile(res.data.data)
      }else{
        alert(res.data.message)
      }
     
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      const res = await axiosClient.patch(`/api/userUpdate/${id}`, data);
      if (res.data.success) {
        alert(res.data.message || "Profile updated successfully");
      } else {
         alert(res.data.message)
      }
      
    } catch (error) {
      alert(error.response?.data?.message || "Profile update failed");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;
    try {
      const res = await axiosClient.delete(`/api/deleteProfile`);
      if (res.data.success) {
          alert(res.data.message || "Profile deleted successfully");
          navigate("/login");
      }else{
        alert(res.data.message)
      }
    } catch (error) {
      alert(error.response?.data?.message || "Profile delete failed");
    }
  };

  useEffect(() => {
    getProfile();
  }, [id]);

  if (loading) {
    return <h2 className="text-center text-white mt-10">Loading profile...</h2>;
  }

  return (
  <div className="min-h-screen  from-slate-950 via-slate-900 to-cyan-950 flex justify-center items-center px-4 py-10">
    <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">

      <div className="h-40  from-cyan-500 to-blue-600 relative">
        <div className="absolute -bottom-14 left-8">
          <div className="w-28 h-28 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center text-4xl font-bold text-cyan-400 shadow-lg">
          {profile?.firstName?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="pt-20 px-8 pb-8">
        <h2 className="text-3xl font-bold text-white">User Profile</h2>
        <p className="text-slate-400 mt-1">
          Manage your personal information and account settings
        </p>

        <form
          onSubmit={handleSubmit(handleUpdate)}className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8" >
          <div>
            <label className="text-slate-300 text-sm">First Name</label>
            <input type="text"{...register("firstName")}className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800/80 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
            {errors.firstName && (<p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>)}
          </div>

          <div>
            <label className="text-slate-300 text-sm">Last Name</label>
            <input type="text"{...register("lastName")}className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800/80 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
            {errors.lastName && (<p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>)}
          </div>
          <div>
            <label className="text-slate-300 text-sm">Email Address</label>
            <input type="email"{...register("emailId")}className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800/80 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
            {errors.emailId && (<p className="text-red-400 text-sm mt-1">{errors.emailId.message}</p>)}
          </div>
          <div>
            <label className="text-slate-300 text-sm">Age</label>
            <input type="number"{...register("age")}className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800/80 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
            {errors.age && (<p className="text-red-400 text-sm mt-1">{errors.age.message}</p>)}
          </div>

          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-4">
            <button type="submit"className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-cyan-500/20">
              Update Profile
            </button>
            <button type="button"onClick={handleDelete}className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500 py-3 rounded-xl font-semibold transition">
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}
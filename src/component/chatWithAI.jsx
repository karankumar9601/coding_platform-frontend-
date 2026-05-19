import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Send, Bot, User, Loader2, Trash2, Sparkles } from "lucide-react";
import axiosClient from "../utils/axios";

export default function ChatAI({problem}) {
  const [messages, setMessages] = useState([{role:'user',parts:[{text:""}]},{role:'model',parts:[{text:""}]}, ]);

  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const {register,handleSubmit,reset,formState: { errors },} = useForm();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

 const onSubmit = async (data) => {
  setLoading(true);
  const userMsg = {role: "user",parts: [{ text: data.message }],};
  setMessages((prev) => [...prev, userMsg]);
  try {
    const response = await axiosClient.post("/ai/chat", {message: data.message,
      title:problem.title,
      description:problem.description,
      tag:problem.tag,
      testcase:problem.visibleTestCase
    });
    if (response.data.success) {
      setMessages((prev) => [...prev,{role: "model",parts: [{ text: response.data.message }],},]);
    }
    reset();
  } catch (error) {
    setMessages((prev) => [...prev,{role: "model",parts: [{ text: error.response?.data?.message || error.message }],isError: true,},]);
  } finally {
    setLoading(false);
  }
};

  const quickAsk = (text) => {
    reset({ message: text });
  };

  const clearChat = () => {
  setMessages([{role: "model",parts: [{ text: "Chat cleared ✅ Ab apna coding doubt puchho." }],},]);
};

  return (
    <div className="h-[calc(105vh-115px)] w-full bg-[#1a1a1a] text-white flex flex-col rounded-xl border border-[#333] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-[#222] border-b border-[#333] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Bot className="text-emerald-400" size={22} />
          </div>

          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">ChatAI <Sparkles size={16} className="text-yellow-400" /></h2>
            <p className="text-xs text-gray-400">Ask coding doubts, errors, TLE, logic</p>
          </div>
        </div>

        <button onClick={clearChat}className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Quick buttons */}
      <div className="px-5 py-3 border-b border-[#333] bg-[#1f1f1f] flex gap-2 overflow-x-auto">
        <button
          onClick={() => quickAsk("Why my code giving TLE?")}
          className="shrink-0 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm text-gray-300"
        >
          TLE?
        </button>
        <button
          onClick={() => quickAsk("Find bug in my code")}
          className="shrink-0 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm text-gray-300"
        >
          Find Bug
        </button>

        <button
          onClick={() => quickAsk("Dry run my code")}
          className="shrink-0 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm text-gray-300"
        >
          Dry Run
        </button>

        <button
          onClick={() => quickAsk("Explain optimized approach")}
          className="shrink-0 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm text-gray-300"
        >
          Optimize
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {messages.map((msg, index) => (
          <div key={index}className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"  }`}>
              {msg.parts[0].text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit(onSubmit)}className="p-4 bg-[#222] border-t border-[#333]">
        {errors.message && (<p className="text-xs text-red-400 mb-2">Message minimum 2 characters required</p>)}
        <div className="flex items-center gap-3">
          <input type="text"disabled={loading}placeholder="Ask your coding doubt..."
            {...register("message", {required: true,minLength: 2,})}
            className="flex-1 bg-[#151515] border border-[#3a3a3a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 disabled:opacity-60"
          />
          <button type="submit" disabled={errors.message}className="h-12 w-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center transition">
            {loading ? ( <Loader2 size={20} className="animate-spin" />) : (<Send size={20} />)}
          </button>
        </div>
      </form>
    </div>
  );
}
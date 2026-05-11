import axiosClient from "../../utils/axios"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm,useFieldArray} from "react-hook-form"
import { useEffect, useState } from "react";
import {useParams,useNavigate, data} from "react-router"

const ProblemSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description is required"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    tag: z.string().min(2, "Tag is required"),
    visibleTestCase: z.array(
        z.object({
            input: z.string().min(1, "Input required"),
            output: z.string().min(1, "Output required"),
            Explanation: z.string().optional(),
        })
    ),

    invisibleTestCase: z.array(
        z.object({
            input: z.string().min(1, "Input required"),
            output: z.string().min(1, "Output required"),
        })
    ),

    referenceSolution: z.array(
        z.object({
            language: z.enum(["java", "c++", "javascript"]),
            completeCode: z.string().min(1, "Reference solution required"),
        })
    ).length(3, "All three language required"),

    startCode: z.array(
        z.object({
            language: z.enum(["java", "c++", "javascript"]),
            initialCode: z.string().min(1, "Start code required"),
        })
    ).length(3, "All three language required"),
});
export default function UpdateProblem(){

    const {id}=useParams();
    const navigate=useNavigate()
   
     const { register, handleSubmit, control,reset, formState: { errors }, } = useForm({
            resolver: zodResolver(ProblemSchema), defaultValues: {
                title: "",
                description: "",
                difficulty: "easy",
                tag: "",
                visibleTestCase: [
                    {
                        input: "",
                        output: "",
                        Explanation: "",
                    },
                ],
                invisibleTestCase: [
                    {
                        input: "",
                        output: "",
                    },
                ],
                referenceSolution: [
                    { language: "java", completeCode: "" },
                    { language: "c++", completeCode: "" },
                    { language: "javascript", completeCode: "" },
                ],
                startCode: [
                    { language: "java", initialCode: "" },
                    { language: "c++", initialCode: "" },
                    { language: "javascript", initialCode: "" },
                ],
            }
        });
        const { fields: visibleFields, append: addVisible, remove: removeVisible, } = useFieldArray({ control, name: "visibleTestCase", });
        const { fields: invisibleFields, append: addInvisible, remove: removeInvisible, } = useFieldArray({ control, name: "invisibleTestCase", });

        const updateProblem=async(data)=>{
            try {
                const res=await axiosClient.put(`/problem/${id}`,data) 
                if (res.data.success) {
                    alert(res.data.message)
                    navigate("/dashboard")
                } 
            } catch (error) {
               console.log(error.response?.data);
                alert("something went wrong")
            }
        }

        const getProblemDetails=async(id)=>{
            try {
                 const res=await axiosClient.get(`/problem/${id}`)
            if (res.data.success) {
                reset(res.data.data)
            }
            } catch (error) {
                console.log(error.response?.data);
                alert("something went wrong")
            }
        }

        useEffect(()=>{
            getProblemDetails(id)
        },[reset,id])
    return(
         <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-5xl mx-auto bg-slate-900 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Update Problem</h2>

                <form onSubmit={handleSubmit(updateProblem)} className="space-y-6">
                    <input {...register("title")} placeholder="Problem Title" className="w-full p-3 rounded bg-slate-800 border border-slate-700" />
                    <p className="text-red-400">{errors.title?.message}</p>
                    <textarea {...register("description")} placeholder="Problem Description" rows="5" className="w-full p-3 rounded bg-slate-800 border border-slate-700" />
                    <p className="text-red-400">{errors.description?.message}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <select {...register("difficulty")} className="p-3 rounded bg-slate-800 border border-slate-700">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                        <input {...register("tag")} placeholder="Tag e.g. graph" className="p-3 rounded bg-slate-800 border border-slate-700" />
                    </div>

                    <h3 className="text-xl font-semibold">Visible Test Cases</h3>

                    {visibleFields.map((field, index) => (
                        <div key={field.id} className="bg-slate-800 p-4 rounded-xl space-y-3">
                            <textarea {...register(`visibleTestCase.${index}.input`)} placeholder="Input" className="w-full p-3 rounded bg-slate-700" />
                            <textarea {...register(`visibleTestCase.${index}.output`)} placeholder="Output" className="w-full p-3 rounded bg-slate-700" />
                            <input {...register(`visibleTestCase.${index}.Explanation`)} placeholder="Explanation" className="w-full p-3 rounded bg-slate-700" />
                            <button type="button" onClick={() => removeVisible(index)} className="bg-red-500 px-4 py-2 rounded">Remove</button>
                        </div>
                    ))}

                    <button type="button" onClick={() => addVisible({ input: "", output: "", Explanation: "" })} className="bg-cyan-500 text-black px-4 py-2 rounded">Add Visible Test Case</button>

                    <h3 className="text-xl font-semibold">Invisible Test Cases</h3>

                    {invisibleFields.map((field, index) => (
                        <div key={field.id} className="bg-slate-800 p-4 rounded-xl space-y-3">
                            <textarea {...register(`invisibleTestCase.${index}.input`)} placeholder="Input" className="w-full p-3 rounded bg-slate-700" />
                            <textarea {...register(`invisibleTestCase.${index}.output`)} placeholder="Output" className="w-full p-3 rounded bg-slate-700" />
                            <button type="button" onClick={() => removeInvisible(index)} className="bg-red-500 px-4 py-2 rounded">Remove</button>
                        </div>
                    ))}

                    <button type="button" onClick={() => addInvisible({ input: "", output: "" })} className="bg-cyan-500 text-black px-4 py-2 rounded">Add Invisible Test Case</button>

                    <h3 className="text-xl font-semibold">Reference Solution</h3>

                    {["java", "c++", "javascript"].map((lang, index) => (
                        <div key={lang} className="mb-6">
                            <h4 className="mb-2 capitalize font-semibold">{lang}</h4>
                            <input type="hidden" value={lang}{...register(`referenceSolution.${index}.language`)} />
                            <textarea {...register(`referenceSolution.${index}.completeCode`)} placeholder={`${lang} reference solution`} rows="8" className="w-full p-3 rounded bg-slate-800 border border-slate-700 font-mono" />
                        </div>
                    ))}
                    <h3 className="text-xl font-semibold">Start Code</h3>

                    {["java", "c++", "javascript"].map((lang, index) => (
                        <div key={lang} className="mb-6">
                            <h4 className="mb-2 capitalize font-semibold">{lang}</h4>
                            <input type="hidden" value={lang}{...register(`startCode.${index}.language`)} />
                            <textarea {...register(`startCode.${index}.initialCode`)} placeholder={`${lang} starter code`} rows="6" className="w-full p-3 rounded bg-slate-800 border border-slate-700 font-mono" />
                        </div>
                    ))}

                    <button type="submit" className="w-full bg-green-500 text-black font-semibold py-3 rounded-xl">Update Problem</button>
                </form>
            </div>
        </div>
    )
}
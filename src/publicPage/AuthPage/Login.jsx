import { zodResolver } from "@hookform/resolvers/zod"
import {z} from "zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"

const loginSchema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "password should contain atleast 8 character")
})

export default function Login(){

    const navigate=useNavigate()
    const { register, handleSubmit,reset, formState: { errors }, } = useForm({ resolver: zodResolver(loginSchema) });

    const loginData=(submittedData)=>{
        console.log(submittedData);
        reset()
        
    }
    return(
         <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center">Login Account</h2>
                    <p className="text-center text-sm text-base-content/60 mb-4">
                        Login and start solving coding problems
                    </p>

                    <form onSubmit={handleSubmit(loginData)} className="space-y-4">
                     
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Email</legend>
                            <input type="email"placeholder="karan@gmail.com"className="input input-bordered w-full focus:outline-none focus:border-orange-500"{...register("email")}/>
                            {errors.email && (<p className="text-error text-sm">{errors.email.message}</p>)}
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Password</legend>
                            <input type="password"placeholder="••••••••"className="input input-bordered w-full focus:outline-none focus:border-orange-500"{...register("password")}/>
                            {errors.password && (<p className="text-error text-sm">{errors.password.message}</p>)}
                        </fieldset>

                        <button type="submit"className="btn w-full bg-gray-600 hover:bg- text-white border-none mt-2">Login</button>
                    </form>

                    <div className="divider text-xs">OR</div>

                    <p className="text-center text-sm text-base-content/70">
                        Don't have an account?
                        <button type="button"className="link text-blue-600 ml-1"onClick={() => navigate("/signup")}>SignUp</button>
                    </p>
                </div>
            </div>
        </div>
    )
}
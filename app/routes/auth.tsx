import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => {
  return [
    { title: "Auth - Resumind Dz" },
    { name: "description", content: "Authentication Page for Resumind Dz" },
  ];
}

const auth = () => {  
    const {isLoading,auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1] || '/';
    const navigate = useNavigate();
    useEffect(()=>{
        if(auth.isAuthenticated) navigate(next);
    },[auth.isAuthenticated,next]);
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-3xl font-bold">Welcome to Resumind Dz</h1>
                    <h2>Login To Continue Your Job Journey</h2>
                </div>
                <div>
                    {isLoading ? (
                        <button className="auth-button animate-pulse" disabled>
                            <p>Signing you in...</p>
                        </button>
                    ) : (
                        <>
                            {auth.isAuthenticated ? (
                                <button className="auth-button w-full" onClick={auth.signOut}>
                                    <p>Continue to App</p>
                                </button>
                            ) : (
                                <button className="auth-button w-full" onClick={auth.signIn}>
                                    <p>Login</p>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    </main>
  )
}

export default auth

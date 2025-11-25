import NavBar from "~/components/NavBar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind Dz" },
    { name: "description", content: "Smart Feedback for your Dreamjob" },
  ];
}

export default function Home() {
  return <>
    <NavBar />
    <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
        <section className="main-section" >
          <div className="page-heading py-16">
            <h1>
              Track Your Applications & Resume Ratings
            </h1>
            <h2>
              Review Your Submission and check AI-Powered Feedback.
            </h2>
          </div>
          {resumes.length > 0 && (
            <div className="resumes-section"> 
              {resumes.map((resume) => (
                
                  <ResumeCard key={resume.id} resume={resume} />
                
              ))}
            </div>
          )}


        </section>
      </main>
  </>
}

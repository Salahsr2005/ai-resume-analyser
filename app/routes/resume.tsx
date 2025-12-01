import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            try {
                const resume = await kv.get(`resume:${id}`);

                if(!resume) {
                    console.error('Resume not found');
                    return;
                }

                const data = JSON.parse(resume);
                console.log('Loaded resume data:', data);

                const resumeBlob = await fs.read(data.resumePath);
                if(!resumeBlob) {
                    console.error('Failed to read resume file');
                    return;
                }

                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                const resumeUrl = URL.createObjectURL(pdfBlob);
                setResumeUrl(resumeUrl);

                const imageBlob = await fs.read(data.imagePath);
                if(!imageBlob) {
                    console.error('Failed to read image file');
                    return;
                }
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageUrl);

                // Check if feedback is a string and parse it, or use it directly
                let feedbackData = typeof data.feedback === 'string' 
                    ? JSON.parse(data.feedback) 
                    : data.feedback;
                
                // Transform the feedback data to match component expectations
                if (feedbackData && feedbackData.ats_score !== undefined) {
                    feedbackData = {
                        overallScore: Math.round(feedbackData.overall_rating * 10) || 0,
                        ATS: {
                            score: Math.round(feedbackData.ats_score * 10) || 0,
                            tips: [
                                ...(feedbackData.strengths || []).map((tip: string) => ({ type: 'good' as const, tip })),
                                ...(feedbackData.weaknesses || []).map((tip: string) => ({ type: 'improve' as const, tip }))
                            ]
                        },
                        toneAndStyle: {
                            score: 75, // Default score, adjust based on your data
                            tips: []
                        },
                        content: {
                            score: 70,
                            tips: []
                        },
                        structure: {
                            score: 80,
                            tips: []
                        },
                        skills: {
                            score: 65,
                            tips: feedbackData.missing_keywords 
                                ? feedbackData.missing_keywords.map((keyword: string) => ({
                                    type: 'improve' as const,
                                    tip: `Add keyword: ${keyword}`,
                                    explanation: `This keyword was found in the job description but not in your resume.`
                                }))
                                : []
                        }
                    };
                }
                
                console.log('Parsed feedback:', feedbackData);
                setFeedback(feedbackData);
            } catch (error) {
                console.error('Error loading resume:', error);
            }
        }

        loadResume();
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {!feedback ? (
                        <div className="flex flex-col items-center gap-4">
                            <img src="/images/resume-scan-2.gif" className="w-full" />
                            <p className="text-gray-500">Loading feedback...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            {feedback.ATS && (
                                <ATS 
                                    score={feedback.ATS.score || 0} 
                                    suggestions={feedback.ATS.tips || []} 
                                />
                            )}
                            <Details feedback={feedback} />
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
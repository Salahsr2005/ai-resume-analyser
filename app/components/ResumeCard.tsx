import { Link } from "react-router"
import { resumes } from "../../constants"
import ScoreCircle from "./ScoreCircle"

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 block"
    >
      <div className="resume-card-header flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words">{companyName}</h2>
          <h3 className="!text-gray-700 break-words">{jobTitle}</h3>
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-500 ease-in-out mt-4">
        <img
          src={imagePath}
          alt={`${companyName} Resume`}
          className="w-full h-[350px] max-sm:h-[200px] object-cover rounded-md"
        />
      </div>
    </Link>
  );
};


export default ResumeCard

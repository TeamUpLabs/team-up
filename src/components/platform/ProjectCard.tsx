import { Project } from "@/types/Project";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <span className="text-sm text-green-400">{project.status}</span>
      </div>
      <p className="text-gray-400 mb-4 line-clamp-2 min-h-[3rem]">{project.description}</p>
      <div className="flex items-center space-x-2 mb-4">
        {project.roles.map((role, index) => (
          <span key={index} className="text-sm bg-purple-900/50 text-purple-300 px-2 py-1 rounded">{role}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {
            project.members.map((member => (
              <div key={member.id} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 text-sm flex align-center justify-center place-items-center">
                {member.name.charAt(0)}
              </div>
            )))
          }
        </div>
        <Link href={`/platform/${project.id}`} className="text-sm text-purple-400 hover:text-purple-300">
          참여하기
        </Link>
      </div>
    </div>
  )
}
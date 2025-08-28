// @ts-nocheck
import React from 'react'

const SpecialProjects = ({projects}) => {
  if (!projects || projects.length === 0) {
    return null // Return nothing if no projects
  }

  return (
    <div className="border-t border-white">
      <h3 className="mb-2 mt-2">Special Projects</h3>
      <div className="">
        {projects.map((project, index) => (
          <div key={index} className="py-2">
            <a
              href={project.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:italic"
              style={{color: project.color || undefined}}
            >
              <div className="grid grid-cols-2">
                <div>
                  <h4>{project.title}</h4>
                  {/* <div>{project.year}</div> */}
                </div>
                <div className="text-right">
                  {project.year}
                  {/* {project.link && <span className="underline">Link</span>} */}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpecialProjects

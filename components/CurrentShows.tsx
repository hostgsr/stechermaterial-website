// @ts-nocheck
import Link from 'next/link'
import React from 'react'

const CurrentShows = ({shows}) => {
  if (!shows || shows.length === 0) {
    return null // Return nothing if no shows
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="">
      <h3 className="  mb-2">Current exhibitions</h3>

      <div className="">
        {shows.map((show, index) => (
          <div key={index} className=" ">
            <Link
              href={show.slug ? `/exhibitions/${show.slug}` : '#'}
              className="block hover:italic"
            >
              <div className="grid grid-cols-2 py-2 ">
                <div>
                  <h4 className="text-white  ">{show.title}</h4>
                  <div className="">{formatDate(show.date)}</div>
                </div>

                <div className="whitespace-pre-line text-right">{show.location}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CurrentShows

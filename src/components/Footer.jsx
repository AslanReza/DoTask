import React from 'react'
import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { FaReact } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-neutral-800 fixed bottom-0 w-full text-xs p-1">
      <div className="flex justify-center px-2 items-center text-neutral-400">
        <p>© 2024 OnTask</p>
        <p className="px-4">|</p>
        <p className="flex items-center gap-1 hover:text-white">
          Made with <FaHeart color="red" /> and <FaReact color="cyan" />
        </p>
        <p className="px-4">|</p>
        <div className="flex items-center">
          <Link
            className="text-lg rounded-full"
            target="_blank"
            to={'https://github.com/AslanReza?tab=following'}
          >
            <FaGithub />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer

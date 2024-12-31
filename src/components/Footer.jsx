import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-green-700 text-neutral-300 p-0 fixed bottom-0 w-full">
      <div className="container mx-auto flex justify-center  items-center text-xs">
        {/* Center Section (Links) */}
        <div className="flex justify-center gap-4 p-1 sm:mb-0">
          <Link
            to="/about"
            className="hover:text-green-950 transition-colors text-sm"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="hover:text-green-950 transition-colors text-sm"
          >
            Contact
          </Link>
          <Link
            to="/privacy"
            className="hover:text-green-950 transition-colors text-sm"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="hover:text-green-950 transition-colors text-sm"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer

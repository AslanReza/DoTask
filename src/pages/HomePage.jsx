import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaReact } from 'react-icons/fa'
import { TbSquareRoundedArrowRightFilled } from 'react-icons/tb'

const HomePage = () => {
  const navigate = useNavigate()

  const handleLoginRedirect = () => {
    navigate('/login')
  }
  return (
    <div className="flex flex-col justify-between items-center h-screen w-full bg-gradient-to-b from-neutral-800 to-black text-white">
      <main className="flex flex-col items-center justify-center flex-1 px-4 text-center  gap-6">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-[2.6rem] md:text-[4rem] lg:text-[6rem] rubik-80s-fade-regular">
            Welcome to <span className="text-green-500">OnTask</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-3xl">
            Unlock the ultimate potential of task management with{' '}
            <span className="text-green-500">OnTask</span>, your go-to solution
            for staying organized, productive, and stress-free. Whether you're
            spearheading a team project or keeping tabs on personal goals,{' '}
            <span className="text-green-500">OnTask</span> empowers you to
            prioritize effectively, track progress seamlessly, and meet
            deadlines effortlessly.
          </p>
          <p className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-3xl">
            Your tasks are securely stored and instantly accessible through
            Firebase, ensuring you can focus on achieving what truly matters.
            Elevate your workflow and experience productivity redefined with{' '}
            <span className="text-green-500">OnTask</span>.
          </p>
          <p className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-3xl">
            Made with <FaHeart className="text-red-500 inline" /> and{' '}
            <FaReact className="text-cyan-500 inline" /> by OnTask Team.
          </p>
        </div>
        <button
          className="text-neutral-300 flex items-center gap-2 bg-green-900 hover:bg-green-800 focus:text-neutral-800 focus:bg-green-600 px-12 py-2 rounded-lg text-xl shadow-md transition-transform transform hover:scale-105"
          onClick={handleLoginRedirect}
        >
          Let&apos;s Get Started{' '}
          <TbSquareRoundedArrowRightFilled className="text-3xl" />
        </button>
      </main>
    </div>
  )
}

export default HomePage

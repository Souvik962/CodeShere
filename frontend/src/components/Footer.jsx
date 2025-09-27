import React from 'react'
import { Link } from "react-router-dom";
import { Heart, Code, Coffee } from "lucide-react";

const Footer = () => {
  return (
    <>
      <div className="relative flex justify-center items-center h-16 w-full bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-zinc-100 dark:text-zinc-300 border-t border-amber-200/30 dark:border-amber-600/30 mt-0.5 backdrop-blur-sm">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-2 -left-4 w-8 h-8 bg-amber-400/20 rounded-full animate-pulse"></div>
          <div className="absolute -top-1 right-1/4 w-4 h-4 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -top-3 right-1/3 w-6 h-6 bg-purple-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Main content */}
        <div className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 shadow-lg">
          {/* Left decorative icon */}
          <div className="flex items-center gap-1 text-amber-400">
            <Code size={16} className="animate-pulse" />
            <span className="text-xs hidden sm:inline">Made with</span>
          </div>

          {/* Animated heart */}
          <Heart
            size={16}
            className="text-red-400 animate-pulse hover:scale-125 transition-transform duration-200"
            fill="currentColor"
          />

          {/* Copyright text */}
          <p className="text-sm font-medium flex items-center gap-2">
            &copy; {new Date().getFullYear()}
            <Link
              to="https://www.instagram.com/this.is.souvik711?igsh=YzNqejFodzlmNTlt"
              target='_blank'
              className='relative group font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-pink-400 transition-all duration-300'
            >
              Souvik Mondal
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </p>

          {/* Rights text with coffee icon */}
          <div className="flex items-center gap-1 text-xs text-zinc-300 dark:text-zinc-400">
            <span>All rights reserved</span>
            <Coffee size={14} className="text-amber-500 hover:animate-spin transition-transform duration-200" />
          </div>
        </div>

        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>

        {/* Corner decorative elements */}
        <div className="absolute bottom-1 left-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </>
  )
}

export default Footer
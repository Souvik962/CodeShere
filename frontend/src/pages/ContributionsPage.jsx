import { Code, SquarePen, Globe, Lock, ChevronDown, Sparkles, Upload, FileCode, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { usePostStore } from '../store/usePostStore';
import toast from 'react-hot-toast';

const ContributionsPage = () => {
  const { authUser } = useAuthStore();
  const [projectName, setProjectName] = useState('')
  const [programmingLanguage, setProgrammingLanguage] = useState('')
  const [projectCode, setProjectCode] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false)
  const { sendPost } = usePostStore();

  const getFileExtension = (language) => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      csharp: 'cs',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      swift: 'swift',
      kotlin: 'kt',
      typescript: 'ts',
      html: 'html',
      css: 'css',
      sql: 'sql',
      r: 'r',
      matlab: 'm',
      scala: 'scala',
      dart: 'dart',
      bash: 'sh',
      other: 'txt'
    }
    return extensions[language] || 'txt'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!projectName.trim() && !programmingLanguage.trim() && !projectCode.trim()) return;
    if (projectName.trim() && programmingLanguage.trim() && projectCode.trim()) {
      console.log('Submitting project:', { projectName, programmingLanguage, projectCode, privacy })
    }
    try {
      await sendPost({
        projectName: projectName.trim(),
        programmingLanguage: programmingLanguage.trim(),
        projectCode: projectCode.trim(),
        privacy: privacy.trim(),
      });
      setProjectName("");
      setProgrammingLanguage("");
      setProjectCode("");
      setPrivacy("public");
      toast.success("Share Project Successfully");
    } catch (error) {
      console.error("Failed to send post:", error);
    }
  }

  const isFormValid = projectName.trim() && programmingLanguage.trim() && projectCode.trim()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              <Upload className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-xl">Share Your Masterpiece</span>
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              Create Something Amazing
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Share your code with the world and inspire fellow developers
            </p>
          </div>

          {/* Main Form Container */}
          <div className="relative group">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-2xl"></div>

              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <FileCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Submission</h2>
                    <p className="text-gray-600 dark:text-gray-400">Fill out the details below to share your project</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="relative p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* User Info Section */}
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-700/30 dark:to-blue-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="relative">
                      <img
                        src={authUser.profilePic || "/avatar.png"}
                        alt="Profile"
                        className="size-16 rounded-full border-4 border-gradient-to-r from-blue-400 to-purple-500 object-cover shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{authUser?.fullName}</p>
                      {/* Privacy Selector */}
                      <div className="relative mt-2">
                        <button
                          type="button"
                          onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                          className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-700/80 rounded-full border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                        >
                          {privacy === 'public' ? 
                            <Globe className="w-4 h-4 text-green-500" /> : 
                            <Lock className="w-4 h-4 text-orange-500" />
                          }
                          <span className={privacy === 'public' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>
                            {privacy === 'public' ? 'Public' : 'Private'}
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {showPrivacyDropdown && (
                          <div className="absolute top-full left-0 mt-2 bg-white/95 dark:bg-gray-700/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-2xl z-10 min-w-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <button
                              type="button"
                              onClick={() => { setPrivacy('public'); setShowPrivacyDropdown(false) }}
                              className="flex items-center w-full px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-900 dark:text-white transition-colors"
                            >
                              <Globe className="w-5 h-5 mr-3 text-green-500" />
                              <div>
                                <div className="font-medium">Public</div>
                                <div className="text-xs text-gray-500">Anyone can see this project</div>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => { setPrivacy('private'); setShowPrivacyDropdown(false) }}
                              className="flex items-center w-full px-4 py-3 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-900 dark:text-white transition-colors"
                            >
                              <Lock className="w-5 h-5 mr-3 text-orange-500" />
                              <div>
                                <div className="font-medium">Private</div>
                                <div className="text-xs text-gray-500">Only you can see this project</div>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Name Input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                        <SquarePen className="w-5 h-5 text-white" />
                      </div>
                      <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full p-4 pl-6 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                        placeholder="Enter your amazing project name..."
                        required
                      />
                      {projectName.trim() && (
                        <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-500" />
                      )}
                    </div>
                    {projectName.trim() === '' && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>Project name is required to continue</span>
                      </div>
                    )}
                  </div>

                  {/* Programming Language Selector */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Programming Language <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="relative">
                      <select
                        value={programmingLanguage}
                        onChange={(e) => setProgrammingLanguage(e.target.value)}
                        className="w-full p-4 pl-6 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-500 appearance-none"
                        required
                      >
                        <option value="">Choose your language...</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="csharp">C#</option>
                        <option value="php">PHP</option>
                        <option value="ruby">Ruby</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="swift">Swift</option>
                        <option value="kotlin">Kotlin</option>
                        <option value="typescript">TypeScript</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="sql">SQL</option>
                        <option value="r">R</option>
                        <option value="matlab">MATLAB</option>
                        <option value="scala">Scala</option>
                        <option value="dart">Dart</option>
                        <option value="bash">Bash/Shell</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
                      {programmingLanguage.trim() && (
                        <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-500" />
                      )}
                    </div>
                    {programmingLanguage.trim() === '' && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>Please select a programming language</span>
                      </div>
                    )}
                  </div>

                  {/* Project Code Input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md">
                        <FileCode className="w-5 h-5 text-white" />
                      </div>
                      <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Project Code <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl blur opacity-50"></div>
                      <div className="relative border-2 border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Terminal Header */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                              </div>
                              <span className="text-sm font-medium text-gray-300">
                                {programmingLanguage ? `${projectName || 'untitled'}.${getFileExtension(programmingLanguage)}` : 'code.txt'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-medium text-green-400">
                                Ready to code
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Code Editor */}
                        <div className="relative">
                          <textarea
                            value={projectCode}
                            onChange={(e) => setProjectCode(e.target.value)}
                            className="w-full p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-green-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-vertical min-h-[300px] leading-relaxed"
                            placeholder={`// Welcome to your code editor!
// Paste your amazing code here and share it with the world

function welcomeToCodeShare() {
  console.log('Hello, Amazing Developer! 🚀');
  console.log('Share your code and inspire others!');
  
  // Your brilliant code goes here...
  return 'Ready to change the world! 💫';
}

welcomeToCodeShare();`}
                            rows="15"
                            required
                          />
                          {/* Line numbers effect */}
                          <div className="absolute left-2 top-6 text-gray-600 text-sm font-mono leading-relaxed pointer-events-none select-none">
                            {Array.from({ length: 20 }, (_, i) => (
                              <div key={i + 1} className="h-[1.25rem]">
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {projectCode.trim() === '' && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>Your code is the heart of your project</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`relative w-full py-5 px-8 font-bold text-lg rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 overflow-hidden group ${
                        isFormValid
                          ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white shadow-2xl hover:shadow-blue-500/25 transform hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        {isFormValid ? (
                          <>
                            <Zap className="w-6 h-6 animate-pulse" />
                            <span>Share Your Masterpiece</span>
                            <Sparkles className="w-6 h-6 animate-bounce" />
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-6 h-6" />
                            <span>Complete All Fields to Continue</span>
                          </>
                        )}
                      </div>
                      {isFormValid && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </button>
                  </div>

                  {/* Form Progress Indicator */}
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full transition-all duration-200 ${projectName.trim() ? 'bg-green-500 shadow-lg' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full transition-all duration-200 ${programmingLanguage.trim() ? 'bg-green-500 shadow-lg' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Language</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full transition-all duration-200 ${projectCode.trim() ? 'bg-green-500 shadow-lg' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Code</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContributionsPage
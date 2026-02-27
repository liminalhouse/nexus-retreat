import type React from 'react'

export function EditLoadingState({message = 'Loading...'}: {message?: string}) {
  return (
    <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">{message}</p>
      </div>
    </div>
  )
}

export function EditErrorState({error}: {error: string | null}) {
  return (
    <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <svg
          className="h-16 w-16 text-red-400 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load</h1>
        <p className="text-gray-600 mb-6">{error}</p>
      </div>
    </div>
  )
}

export function EditSuccessState({
  title,
  message,
  actions,
}: {
  title: string
  message: string
  actions: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <svg
          className="h-16 w-16 text-green-400 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-y-3">{actions}</div>
      </div>
    </div>
  )
}

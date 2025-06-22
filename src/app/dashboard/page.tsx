"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-semibold text-gray-900">
                Fit Project Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/plan"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                My Plan
              </Link>
              <Link
                href="/log"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Log Meal
              </Link>
              <div className="flex items-center space-x-3">
                {session.user?.image && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || "User"}
                  />
                )}
                <span className="text-sm text-gray-700">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your Fitness Dashboard!
              </h2>
              <p className="text-gray-600 mb-4">
                You&apos;re successfully signed in as {session.user?.email}
              </p>
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Authentication is working perfectly! 🎉
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 
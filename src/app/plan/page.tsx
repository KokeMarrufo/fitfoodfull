"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Define the shape of the plan
interface Plan {
  carbsGoal: number
  lactoseAnimalGoal: number
  fruitsGoal: number
  veggiesGoal: number
  goodFatsGoal: number
}

export default function PlanPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [plan, setPlan] = useState<Plan>({
    carbsGoal: 0,
    lactoseAnimalGoal: 0,
    fruitsGoal: 0,
    veggiesGoal: 0,
    goodFatsGoal: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [message, setMessage] = useState("")

  // Protect the route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Fetch the user's current plan
  useEffect(() => {
    if (session) {
      const fetchPlan = async () => {
        try {
          const response = await fetch("/api/plan")
          if (response.ok) {
            const data = await response.json()
            if (data) {
              setPlan(data)
            }
          }
        } catch (error) {
          console.error("Failed to fetch plan:", error)
          setMessage("Could not load your plan.")
        } finally {
          setIsFetching(false)
        }
      }
      fetchPlan()
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPlan((prevPlan) => ({
      ...prevPlan,
      [name]: parseInt(value, 10) >= 0 ? parseInt(value, 10) : 0,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      })

      if (response.ok) {
        setMessage("Plan saved successfully!")
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || "Failed to save plan.")
      }
    } catch (error) {
      console.error("Failed to save plan:", error)
      setMessage("An error occurred while saving.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const categoryLabels: { key: keyof Plan; label: string }[] = [
    { key: "carbsGoal", label: "Carbs" },
    { key: "lactoseAnimalGoal", label: "Lactose/Animal" },
    { key: "fruitsGoal", label: "Fruits" },
    { key: "veggiesGoal", label: "Veggies" },
    { key: "goodFatsGoal", label: "Good Fats" },
  ]

  if (status === "loading" || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Set Your Daily Meal Plan</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 mb-6">
            Define the number of portions you aim to eat for each category per day. This will be your baseline for earning points.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryLabels.map(({ key, label }) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={plan[key]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    min="0"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-end items-center">
              {message && <p className="text-sm text-gray-600 mr-4">{message}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Plan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 
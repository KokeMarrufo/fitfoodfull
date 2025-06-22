"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Define types to match our prisma schema
type MealCategory = "CARBS" | "LACTOSE_ANIMAL" | "FRUITS" | "VEGGIES" | "GOOD_FATS" | "PROHIBITED"
type DailyLog = {
    [key in MealCategory]: number
}

const categoryDetails: { name: MealCategory; label: string; color: string }[] = [
    { name: "CARBS", label: "Carbs", color: "bg-yellow-500" },
    { name: "LACTOSE_ANIMAL", label: "Lactose/Animal", color: "bg-blue-500" },
    { name: "FRUITS", label: "Fruits", color: "bg-pink-500" },
    { name: "VEGGIES", label: "Veggies", color: "bg-green-500" },
    { name: "GOOD_FATS", label: "Good Fats", color: "bg-purple-500" },
    { name: "PROHIBITED", label: "Prohibited", color: "bg-red-600" },
]

export default function LogMealPage() {
    const { status } = useSession();
    const router = useRouter();
    const [dailyLog, setDailyLog] = useState<DailyLog>({
        CARBS: 0, LACTOSE_ANIMAL: 0, FRUITS: 0, VEGGIES: 0, GOOD_FATS: 0, PROHIBITED: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState('');

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Protect route and fetch today's logs
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
        if (status === 'authenticated') {
            fetchTodaysLog();
        }
    }, [status, router]);

    const fetchTodaysLog = async () => {
        setIsFetching(true);
        try {
            const response = await fetch('/api/log');
            if (response.ok) {
                const data = await response.json();
                const newLog: DailyLog = { CARBS: 0, LACTOSE_ANIMAL: 0, FRUITS: 0, VEGGIES: 0, GOOD_FATS: 0, PROHIBITED: 0 };
                data.logs.forEach((log: { category: MealCategory }) => {
                    newLog[log.category] = (newLog[log.category] || 0) + 1;
                });
                setDailyLog(newLog);
            }
        } catch (error) {
            console.error("Failed to fetch today's log", error);
            setMessage("Could not load today's log.");
        } finally {
            setIsFetching(false);
        }
    };

    const handleLogMeal = async (category: MealCategory) => {
        setIsLoading(true);
        setMessage('');
        try {
            const response = await fetch('/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category }),
            });

            if (response.ok) {
                // Optimistically update UI
                setDailyLog(prevLog => ({
                    ...prevLog,
                    [category]: prevLog[category] + 1
                }));
                 setMessage(`${category} logged successfully!`);
                 // Optionally re-fetch to ensure sync and get new score
                 fetchTodaysLog();
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || "Failed to log meal.");
            }
        } catch (error) {
            console.error("Failed to log meal", error);
            setMessage("An error occurred while logging the meal.");
        } finally {
            setIsLoading(false);
        }
    }
    
    if (status === 'loading' || isFetching) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Log Your Meals</h1>
                    <p className="text-lg text-gray-600 mt-2">{today}</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Today&apos;s Consumption</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {categoryDetails.map(({ name, label }) => (
                            <div key={name} className="bg-gray-100 p-4 rounded-lg text-center">
                                <p className="text-sm font-medium text-gray-600">{label}</p>
                                <p className="text-3xl font-bold text-gray-900">{dailyLog[name]}</p>
                            </div>
                        ))}
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Add a Portion</h2>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {categoryDetails.map(({ name, label, color }) => (
                            <button
                                key={`btn-${name}`}
                                onClick={() => handleLogMeal(name)}
                                disabled={isLoading}
                                className={`${color} text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                     {message && <p className="text-center mt-6 text-sm text-gray-600">{message}</p>}
                </div>
            </div>
        </div>
    )
} 
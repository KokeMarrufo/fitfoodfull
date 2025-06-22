import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { calculateDailyScore } from "@/lib/scoring"
import type { Session } from "next-auth"

// GET handler to fetch today's meal logs
export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  try {
    const logs = await prisma.mealLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    const score = await prisma.dailyScore.findFirst({
        where: { userId, date: startOfDay }
    })

    return NextResponse.json({ logs, score: score?.points ?? 0 })
  } catch (error) {
    console.error("Error fetching today's log:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST handler to log a new meal and calculate score
export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const body = await request.json()
    const { category } = body

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    // Log the meal
    const newLog = await prisma.mealLog.create({
      data: {
        userId,
        category,
        date: new Date(),
      },
    })

    // Recalculate and save the score for today
    await calculateDailyScore(userId, new Date())

    return NextResponse.json(newLog, { status: 201 })
  } catch (error) {
    console.error("Error logging meal:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 
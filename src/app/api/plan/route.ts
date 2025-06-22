import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import type { Session } from "next-auth"

// GET handler to fetch the user's plan
export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const plan = await prisma.plan.findUnique({
      where: { userId: session.user.id },
    })
    return NextResponse.json(plan)
  } catch (error) {
    console.error("Error fetching plan:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST handler to create or update the user's plan
export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      carbsGoal,
      lactoseAnimalGoal,
      fruitsGoal,
      veggiesGoal,
      goodFatsGoal,
    } = body

    const userId = session.user.id;

    // Validate input to ensure they are numbers
    const planData = {
      carbsGoal: Number(carbsGoal) || 0,
      lactoseAnimalGoal: Number(lactoseAnimalGoal) || 0,
      fruitsGoal: Number(fruitsGoal) || 0,
      veggiesGoal: Number(veggiesGoal) || 0,
      goodFatsGoal: Number(goodFatsGoal) || 0,
    }

    const updatedPlan = await prisma.plan.upsert({
      where: { userId },
      update: planData,
      create: { ...planData, userId },
    })

    return NextResponse.json(updatedPlan, { status: 200 })
  } catch (error) {
    console.error("Error saving plan:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 
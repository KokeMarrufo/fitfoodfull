import { prisma } from "@/lib/prisma"

// Manually define types to avoid import issues
type MealCategory = "CARBS" | "LACTOSE_ANIMAL" | "FRUITS" | "VEGGIES" | "GOOD_FATS" | "PROHIBITED"
interface MealLog {
    id: string;
    userId: string;
    category: MealCategory;
    date: Date;
    createdAt: Date;
}

type DailyLogCounts = {
  [key in MealCategory]: number
}

// The main function to calculate the score
export async function calculateDailyScore(userId: string, date: Date): Promise<number> {
  const userPlan = await prisma.plan.findUnique({ where: { userId } })
  if (!userPlan) return 0 // No plan, no points

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const todaysLogs = await prisma.mealLog.findMany({
    where: {
      userId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })

  const logCounts: DailyLogCounts = {
    CARBS: 0,
    LACTOSE_ANIMAL: 0,
    FRUITS: 0,
    VEGGIES: 0,
    GOOD_FATS: 0,
    PROHIBITED: 0,
  }

  todaysLogs.forEach((log: MealLog) => {
    logCounts[log.category]++
  })

  // Calculate scores for each category based on the rules
  const categoryScores = {
    carbs: calculateCategoryPoints(logCounts.CARBS, userPlan.carbsGoal),
    lactoseAnimal: calculateCategoryPoints(logCounts.LACTOSE_ANIMAL, userPlan.lactoseAnimalGoal),
    fruits: calculateCategoryPoints(logCounts.FRUITS, userPlan.fruitsGoal),
    veggies: calculateCategoryPoints(logCounts.VEGGIES, userPlan.veggiesGoal),
    goodFats: calculateCategoryPoints(logCounts.GOOD_FATS, userPlan.goodFatsGoal),
  }

  // Average the scores
  const scoreValues = Object.values(categoryScores)
  const totalBaseScore = scoreValues.reduce((sum, score) => sum + score, 0)
  const averageScore = totalBaseScore > 0 ? totalBaseScore / scoreValues.length : 0

  // Apply deductions for prohibited items
  const finalScore = applyProhibitedDeductions(averageScore, logCounts.PROHIBITED)
  
  // Save or update the score in the database
  await prisma.dailyScore.upsert({
      where: { userId_date: { userId, date: startOfDay } },
      update: { points: finalScore },
      create: { userId, date: startOfDay, points: finalScore },
  })

  return finalScore
}

// Calculates points for a single category
function calculateCategoryPoints(actual: number, goal: number): number {
  if (goal <= 0) return 100 // If goal is 0 or less, don't penalize.
  if (actual <= goal) return 100 // Perfect score if at or under goal

  // If over goal, deduct points. Score becomes 0 if consumption is double the goal or more.
  const overage = actual - goal
  const deduction = (overage / goal) * 100
  const score = 100 - deduction

  return Math.max(0, score) // Score cannot be negative
}

// Applies penalties for eating prohibited items
function applyProhibitedDeductions(currentScore: number, prohibitedCount: number): number {
  if (prohibitedCount === 1) {
    return currentScore * 0.5 // 50% penalty for one
  }
  if (prohibitedCount > 1) {
    return 0 // 100% penalty for more than one
  }
  return currentScore // No penalty
} 
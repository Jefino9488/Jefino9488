"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export default function ContributionGraph() {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [totalContributions, setTotalContributions] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch GitHub contribution data
    const fetchContributions = async () => {
      try {
        const username = "Jefino9488"
        const currentYear = new Date().getFullYear()
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${currentYear}`)
        const data = await response.json()

        if (data && data.contributions) {
          const contributionDays: ContributionDay[] = data.contributions.map((day: any) => ({
            date: day.date,
            count: day.count,
            level: getLevel(day.count),
          }))

          setContributions(contributionDays)
          const yearKey = Object.keys(data.total)[0]
          setTotalContributions(data.total[yearKey] || 0)
        }
      } catch (error) {
        console.error("Failed to fetch GitHub contributions:", error)
        // Fallback to mock data if API fails
        generateMockData()
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [])

  const getLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count === 0) return 0
    if (count < 3) return 1
    if (count < 6) return 2
    if (count < 9) return 3
    return 4
  }

  const generateMockData = () => {
    const days: ContributionDay[] = []
    const today = new Date()
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(today.getFullYear() - 1)

    let total = 0
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const count = Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0
      total += count
      days.push({
        date: d.toISOString().split("T")[0],
        count,
        level: getLevel(count),
      })
    }
    setContributions(days)
    setTotalContributions(total)
  }

  const getColor = (level: number) => {
    switch (level) {
      case 4:
        return "bg-[#39d353]" // Brightest green
      case 3:
        return "bg-[#26a641]" // Bright green
      case 2:
        return "bg-[#006d32]" // Medium green
      case 1:
        return "bg-[#0e4429]" // Light green
      default:
        return "bg-[#161b22]" // Dark gray for no contributions
    }
  }

  // Organize contributions into weeks properly (GitHub style)
  // Each column is a week, each row is a day of the week (0=Sun, 6=Sat)
  const organizeIntoWeeks = () => {
    if (contributions.length === 0) return []

    const weeks: (ContributionDay | null)[][] = []
    const contributionMap = new Map(contributions.map((c) => [c.date, c]))

    // Get the first day (start of year)
    const firstDate = new Date(contributions[0].date)
    const lastDate = new Date(contributions[contributions.length - 1].date)

    // Start from the beginning of the week containing the first date
    const startDate = new Date(firstDate)
    startDate.setDate(startDate.getDate() - startDate.getDay()) // Go back to Sunday

    const currentDate = new Date(startDate)
    let currentWeek: (ContributionDay | null)[] = []

    while (currentDate <= lastDate || currentWeek.length > 0) {
      const dayOfWeek = currentDate.getDay()

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      const dateStr = currentDate.toISOString().split("T")[0]
      const contribution = contributionMap.get(dateStr)

      if (contribution) {
        currentWeek.push(contribution)
      } else if (currentDate >= firstDate && currentDate <= lastDate) {
        currentWeek.push({ date: dateStr, count: 0, level: 0 })
      } else {
        currentWeek.push(null)
      }

      currentDate.setDate(currentDate.getDate() + 1)

      if (currentDate > lastDate && currentWeek.length > 0) {
        // Fill remaining days in the last week with nulls
        while (currentWeek.length < 7) {
          currentWeek.push(null)
        }
        weeks.push(currentWeek)
        break
      }
    }

    return weeks
  }

  const weeks = organizeIntoWeeks()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">Loading contributions...</div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-foreground mb-4">Contribution Graph</h3>
      <div className="contribution-graph-scroll overflow-x-auto flex-grow flex items-center">
        <div className="min-w-fit mx-auto">
          {/* Months Header */}
          <div className="flex mb-2 text-xs text-muted-foreground">
            {months.map((month, i) => {
              // Calculate approximate week position for each month
              const weekPosition = Math.floor((i / 12) * weeks.length)
              return (
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{
                    width: weekPosition < weeks.length ? `${100 / 12}%` : "auto",
                    minWidth: "40px",
                  }}
                >
                  {month}
                </div>
              )
            })}
          </div>

          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col justify-around text-[10px] text-muted-foreground pr-2 py-1">
              <span>Sun</span>
              <span className="invisible">Mon</span>
              <span>Wed</span>
              <span className="invisible">Thu</span>
              <span>Fri</span>
            </div>

            {/* Grid */}
            <div className="flex gap-[3px] flex-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) =>
                    day ? (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: weekIndex * 0.005 + dayIndex * 0.002, duration: 0.15 }}
                        className={`w-[11px] h-[11px] rounded-[2px] ${getColor(day.level)} hover:ring-2 hover:ring-green-500/50 transition-all cursor-pointer`}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    ) : (
                      <div key={`${weekIndex}-${dayIndex}`} className="w-[11px] h-[11px]" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>
              {totalContributions} contributions in {new Date().getFullYear()}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px]">Less</span>
              <div className="flex gap-1">
                <div className="w-[11px] h-[11px] rounded-[2px] bg-[#161b22]"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-[#0e4429]"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-[#006d32]"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-[#26a641]"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-[#39d353]"></div>
              </div>
              <span className="text-[10px]">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi } from "lucide-react"

interface LiveStatus {
  totalBuses: number
  activeBuses: number
  onTimeBuses: number
  delayedBuses: number
  averageDelay: number
  systemStatus: "operational" | "degraded" | "down"
}

export function LiveStatusBar() {
  const [status, setStatus] = useState<LiveStatus>({
    totalBuses: 45,
    activeBuses: 42,
    onTimeBuses: 38,
    delayedBuses: 4,
    averageDelay: 3.2,
    systemStatus: "operational",
  })

  // Simulate live status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus((prev) => ({
        ...prev,
        activeBuses: Math.max(35, Math.min(45, prev.activeBuses + Math.floor(Math.random() * 3) - 1)),
        onTimeBuses: Math.max(30, Math.min(42, prev.onTimeBuses + Math.floor(Math.random() * 3) - 1)),
        delayedBuses: Math.max(0, Math.min(10, prev.delayedBuses + Math.floor(Math.random() * 3) - 1)),
        averageDelay: Math.max(0, Math.min(10, prev.averageDelay + (Math.random() - 0.5) * 0.5)),
      }))
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "default"
      case "degraded":
        return "secondary"
      case "down":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">System Status</span>
            <Badge variant={getStatusColor(status.systemStatus)} className="capitalize">
              {status.systemStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Wifi className="h-4 w-4" />
            <span>Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{status.activeBuses}</div>
            <div className="text-sm text-muted-foreground">Active Buses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{status.onTimeBuses}</div>
            <div className="text-sm text-muted-foreground">On Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{status.delayedBuses}</div>
            <div className="text-sm text-muted-foreground">Delayed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{status.averageDelay.toFixed(1)}m</div>
            <div className="text-sm text-muted-foreground">Avg Delay</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((status.onTimeBuses / status.activeBuses) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Reliability</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

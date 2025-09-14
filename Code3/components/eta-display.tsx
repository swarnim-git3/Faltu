"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, TrendingUp, AlertCircle } from "lucide-react"

interface ETADisplayProps {
  busId: string
}

interface ETAData {
  busId: string
  stopId: string
  estimatedMinutes: number
  confidence: number
  lastUpdated: string
}

export function ETADisplay({ busId }: ETADisplayProps) {
  const [etaData, setEtaData] = useState<ETAData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock ETA data
    const mockETA: ETAData[] = [
      {
        busId,
        stopId: "STOP_001",
        estimatedMinutes: 5,
        confidence: 0.9,
        lastUpdated: new Date().toISOString(),
      },
      {
        busId,
        stopId: "STOP_002",
        estimatedMinutes: 12,
        confidence: 0.8,
        lastUpdated: new Date().toISOString(),
      },
      {
        busId,
        stopId: "STOP_003",
        estimatedMinutes: 18,
        confidence: 0.7,
        lastUpdated: new Date().toISOString(),
      },
    ]

    setTimeout(() => {
      setEtaData(mockETA)
      setLoading(false)
    }, 500)
  }, [busId])

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-primary"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-destructive"
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return { label: "High", variant: "default" as const }
    if (confidence >= 0.6) return { label: "Medium", variant: "secondary" as const }
    return { label: "Low", variant: "destructive" as const }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {etaData.map((eta, index) => {
        const confidenceBadge = getConfidenceBadge(eta.confidence)

        return (
          <Card key={eta.stopId} className="border-l-4 border-l-primary">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{eta.stopId}</span>
                </div>
                <Badge variant={confidenceBadge.variant} className="text-xs">
                  {confidenceBadge.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-primary">{eta.estimatedMinutes} min</span>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(eta.confidence)}`}>
                    {Math.round(eta.confidence * 100)}% confident
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Updated{" "}
                    {new Date(eta.lastUpdated).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.max(10, 100 - eta.estimatedMinutes * 5)}%`,
                    }}
                  />
                </div>
              </div>

              {eta.confidence < 0.7 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>ETA may vary due to traffic conditions</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>ETAs update every 30 seconds</span>
        </div>
      </div>
    </div>
  )
}

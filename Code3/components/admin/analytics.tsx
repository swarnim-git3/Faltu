"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react"

interface BusData {
  busId: string
  routeId: string
  currentPassengers: number
  capacity: number
  speed: number
  status: "active" | "maintenance" | "offline"
}

interface AnalyticsProps {
  buses: BusData[]
}

export function Analytics({ buses }: AnalyticsProps) {
  // Calculate analytics data
  const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0)
  const totalPassengers = buses.reduce((sum, bus) => sum + bus.currentPassengers, 0)
  const averageSpeed = buses.length > 0 ? Math.round(buses.reduce((sum, bus) => sum + bus.speed, 0) / buses.length) : 0
  const utilizationRate = totalCapacity > 0 ? Math.round((totalPassengers / totalCapacity) * 100) : 0

  // Route performance data
  const routeStats = buses.reduce(
    (acc, bus) => {
      if (!acc[bus.routeId]) {
        acc[bus.routeId] = {
          routeId: bus.routeId,
          buses: 0,
          passengers: 0,
          capacity: 0,
          avgSpeed: 0,
        }
      }
      acc[bus.routeId].buses += 1
      acc[bus.routeId].passengers += bus.currentPassengers
      acc[bus.routeId].capacity += bus.capacity
      acc[bus.routeId].avgSpeed += bus.speed
      return acc
    },
    {} as Record<string, any>,
  )

  // Calculate averages for routes
  Object.values(routeStats).forEach((route: any) => {
    route.avgSpeed = Math.round(route.avgSpeed / route.buses)
    route.utilization = Math.round((route.passengers / route.capacity) * 100)
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Fleet Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalPassengers} of {totalCapacity} seats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{averageSpeed} km/h</div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{Object.keys(routeStats).length}</div>
            <p className="text-xs text-muted-foreground">Currently serving</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">16h</div>
            <p className="text-xs text-muted-foreground">Daily average</p>
          </CardContent>
        </Card>
      </div>

      {/* Route Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Route Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(routeStats).map((route: any) => (
              <div key={route.routeId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{route.routeId}</h4>
                  <div className="text-sm text-muted-foreground">
                    {route.buses} bus{route.buses !== 1 ? "es" : ""}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Utilization</div>
                    <div className="font-medium text-primary">{route.utilization}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Passengers</div>
                    <div className="font-medium">
                      {route.passengers}/{route.capacity}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Avg Speed</div>
                    <div className="font-medium">{route.avgSpeed} km/h</div>
                  </div>
                </div>

                {/* Utilization bar */}
                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${route.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

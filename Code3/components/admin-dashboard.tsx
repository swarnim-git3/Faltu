"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusIcon, RouteIcon, Users, Activity, TrendingUp, AlertTriangle, Plus, Settings, BarChart3 } from "lucide-react"
import { BusManagement } from "./admin/bus-management"
import { RouteManager } from "./admin/route-manager"
import { Analytics } from "./admin/analytics"

interface BusType {
  busId: string
  routeId: string
  currentLocation: {
    latitude: number
    longitude: number
    timestamp: string
  }
  speed: number
  heading: number
  capacity: number
  currentPassengers: number
  isActive: boolean
}

interface RouteType {
  routeId: string
  routeName: string
  stops: Array<{
    stopId: string
    stopName: string
    coordinates: [number, number]
    estimatedTime: number
    order: number
  }>
  frequency: number
  operatingHours: {
    start: string
    end: string
  }
  isActive: boolean
}

interface AdminDashboardProps {
  buses: BusType[]
  routes: RouteType[]
}

export function AdminDashboard({ buses, routes }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate statistics
  const activeBuses = buses.filter((bus) => bus.isActive).length
  const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0)
  const totalPassengers = buses.reduce((sum, bus) => sum + bus.currentPassengers, 0)
  const averageOccupancy = totalCapacity > 0 ? (totalPassengers / totalCapacity) * 100 : 0
  const activeRoutes = routes.filter((route) => route.isActive).length

  // Get buses with issues
  const busesWithIssues = buses.filter((bus) => {
    const occupancy = (bus.currentPassengers / bus.capacity) * 100
    return occupancy > 90 || bus.speed === 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your bus fleet and routes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Bus
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="buses" className="flex items-center gap-2">
            <BusIcon className="h-4 w-4" />
            Buses
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <RouteIcon className="h-4 w-4" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
                <BusIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeBuses}</div>
                <p className="text-xs text-muted-foreground">of {buses.length} total buses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                <RouteIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeRoutes}</div>
                <p className="text-xs text-muted-foreground">of {routes.length} total routes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPassengers}</div>
                <p className="text-xs text-muted-foreground">of {totalCapacity} capacity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageOccupancy.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Fleet utilization</p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts and Issues */}
          {busesWithIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  Buses Requiring Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {busesWithIssues.map((bus) => {
                    const occupancy = (bus.currentPassengers / bus.capacity) * 100
                    const issue = occupancy > 90 ? "Overcrowded" : "Stopped"
                    const issueColor = occupancy > 90 ? "destructive" : "secondary"

                    return (
                      <div key={bus.busId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                          <div>
                            <p className="font-medium">{bus.busId}</p>
                            <p className="text-sm text-muted-foreground">
                              Route: {routes.find((r) => r.routeId === bus.routeId)?.routeName}
                            </p>
                          </div>
                        </div>
                        <Badge variant={issueColor as any}>{issue}</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-muted-foreground">2 minutes ago</span>
                  <span>Bus BUS001 reached Central Station</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span className="text-muted-foreground">5 minutes ago</span>
                  <span>Route Downtown Express updated frequency to 12 minutes</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-muted-foreground">8 minutes ago</span>
                  <span>Bus BUS003 reported high occupancy (95%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buses">
          <BusManagement buses={buses} routes={routes} />
        </TabsContent>

        <TabsContent value="routes">
          <RouteManager routes={routes} buses={buses} />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics buses={buses} routes={routes} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

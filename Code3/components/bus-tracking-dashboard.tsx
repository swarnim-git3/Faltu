"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Navigation, Zap } from "lucide-react"
import { BusMap } from "./bus-map"
import { BusList } from "./bus-list"
import { ETADisplay } from "./eta-display"

interface BusData {
  busId: string
  routeId: string
  currentLocation: {
    latitude: number
    longitude: number
    timestamp: string
  }
  capacity: number
  currentPassengers: number
  isActive: boolean
  speed: number
  heading: number
}

export function BusTrackingDashboard() {
  const [buses, setBuses] = useState<BusData[]>([])
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockBuses: BusData[] = [
      {
        busId: "BUS001",
        routeId: "ROUTE_A",
        currentLocation: {
          latitude: 40.7128,
          longitude: -74.006,
          timestamp: new Date().toISOString(),
        },
        capacity: 50,
        currentPassengers: 32,
        isActive: true,
        speed: 25,
        heading: 90,
      },
      {
        busId: "BUS002",
        routeId: "ROUTE_B",
        currentLocation: {
          latitude: 40.7589,
          longitude: -73.9851,
          timestamp: new Date().toISOString(),
        },
        capacity: 45,
        currentPassengers: 18,
        isActive: true,
        speed: 30,
        heading: 180,
      },
      {
        busId: "BUS003",
        routeId: "ROUTE_C",
        currentLocation: {
          latitude: 40.7505,
          longitude: -73.9934,
          timestamp: new Date().toISOString(),
        },
        capacity: 55,
        currentPassengers: 41,
        isActive: true,
        speed: 15,
        heading: 270,
      },
    ]

    setTimeout(() => {
      setBuses(mockBuses)
      setLoading(false)
    }, 1000)
  }, [])

  const getCapacityStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 90) return { status: "full", color: "bg-destructive" }
    if (percentage >= 70) return { status: "busy", color: "bg-yellow-500" }
    return { status: "available", color: "bg-primary" }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Navigation className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Code on Wheels</h1>
                <p className="text-sm text-muted-foreground">Real-time Bus Tracking System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Live
              </Badge>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{buses.filter((b) => b.isActive).length}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {buses.reduce((sum, bus) => sum + bus.currentPassengers, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all routes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {buses.length > 0 ? Math.round(buses.reduce((sum, bus) => sum + bus.speed, 0) / buses.length) : 0}{" "}
                  km/h
                </div>
                <p className="text-xs text-muted-foreground">Fleet average</p>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Live Bus Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <BusMap buses={buses} selectedBus={selectedBus} onBusSelect={setSelectedBus} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bus List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Active Buses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <BusList
                  buses={buses}
                  selectedBus={selectedBus}
                  onBusSelect={setSelectedBus}
                  getCapacityStatus={getCapacityStatus}
                />
              </CardContent>
            </Card>

            {/* ETA Display */}
            {selectedBus && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Estimated Arrival
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ETADisplay busId={selectedBus} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

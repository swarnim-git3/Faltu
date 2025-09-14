"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Search, Bell, Settings, BusIcon, RouteIcon } from "lucide-react"
import { BusMap } from "./bus-map"
import { BusList } from "./bus-list"
import { ETADisplay } from "./eta-display"
import { AdminDashboard } from "./admin-dashboard"

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

export function BusTrackingApp() {
  const [buses, setBuses] = useState<BusType[]>([])
  const [routes, setRoutes] = useState<RouteType[]>([])
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("map")
  const [isAdmin, setIsAdmin] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockBuses: BusType[] = [
      {
        busId: "BUS001",
        routeId: "ROUTE001",
        currentLocation: { latitude: 40.7128, longitude: -74.006, timestamp: new Date().toISOString() },
        speed: 25,
        heading: 90,
        capacity: 50,
        currentPassengers: 32,
        isActive: true,
      },
      {
        busId: "BUS002",
        routeId: "ROUTE001",
        currentLocation: { latitude: 40.7589, longitude: -73.9851, timestamp: new Date().toISOString() },
        speed: 30,
        heading: 180,
        capacity: 50,
        currentPassengers: 28,
        isActive: true,
      },
      {
        busId: "BUS003",
        routeId: "ROUTE002",
        currentLocation: { latitude: 40.7505, longitude: -73.9934, timestamp: new Date().toISOString() },
        speed: 20,
        heading: 270,
        capacity: 40,
        currentPassengers: 15,
        isActive: true,
      },
    ]

    const mockRoutes: RouteType[] = [
      {
        routeId: "ROUTE001",
        routeName: "Downtown Express",
        stops: [
          {
            stopId: "STOP001",
            stopName: "Central Station",
            coordinates: [-74.006, 40.7128],
            estimatedTime: 0,
            order: 1,
          },
          {
            stopId: "STOP002",
            stopName: "Times Square",
            coordinates: [-73.9851, 40.7589],
            estimatedTime: 15,
            order: 2,
          },
          {
            stopId: "STOP003",
            stopName: "Grand Central",
            coordinates: [-73.9776, 40.7527],
            estimatedTime: 25,
            order: 3,
          },
        ],
        frequency: 15,
        operatingHours: { start: "06:00", end: "23:00" },
        isActive: true,
      },
      {
        routeId: "ROUTE002",
        routeName: "University Loop",
        stops: [
          {
            stopId: "STOP004",
            stopName: "University Gate",
            coordinates: [-73.9934, 40.7505],
            estimatedTime: 0,
            order: 1,
          },
          { stopId: "STOP005", stopName: "Library", coordinates: [-73.9857, 40.7484], estimatedTime: 8, order: 2 },
          {
            stopId: "STOP006",
            stopName: "Student Center",
            coordinates: [-73.9903, 40.7614],
            estimatedTime: 18,
            order: 3,
          },
        ],
        frequency: 10,
        operatingHours: { start: "07:00", end: "22:00" },
        isActive: true,
      },
    ]

    setBuses(mockBuses)
    setRoutes(mockRoutes)
  }, [])

  const filteredBuses = buses.filter(
    (bus) =>
      bus.busId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      routes
        .find((route) => route.routeId === bus.routeId)
        ?.routeName.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <BusIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Code on Wheels</h1>
              <p className="text-sm text-muted-foreground">Real-time Bus Tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={isAdmin ? "default" : "outline"} size="sm" onClick={() => setIsAdmin(!isAdmin)}>
              <Settings className="h-4 w-4 mr-2" />
              {isAdmin ? "User View" : "Admin"}
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search buses, routes, or stops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {isAdmin ? (
          <AdminDashboard buses={buses} routes={routes} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Live Map
              </TabsTrigger>
              <TabsTrigger value="buses" className="flex items-center gap-2">
                <BusIcon className="h-4 w-4" />
                Buses
              </TabsTrigger>
              <TabsTrigger value="routes" className="flex items-center gap-2">
                <RouteIcon className="h-4 w-4" />
                Routes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <BusMap buses={filteredBuses} routes={routes} onBusSelect={setSelectedBus} />
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Live Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {filteredBuses.slice(0, 3).map((bus) => (
                        <div key={bus.busId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{bus.busId}</p>
                            <p className="text-sm text-muted-foreground">
                              {routes.find((r) => r.routeId === bus.routeId)?.routeName}
                            </p>
                          </div>
                          <Badge variant={bus.speed > 0 ? "default" : "secondary"}>
                            {bus.speed > 0 ? "Moving" : "Stopped"}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {selectedBus && <ETADisplay busId={selectedBus} routes={routes} buses={buses} />}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="buses">
              <BusList buses={filteredBuses} routes={routes} onBusSelect={setSelectedBus} />
            </TabsContent>

            <TabsContent value="routes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route) => (
                  <Card key={route.routeId} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {route.routeName}
                        <Badge variant={route.isActive ? "default" : "secondary"}>
                          {route.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Frequency:</span>
                        <span>{route.frequency} min</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Operating Hours:</span>
                        <span>
                          {route.operatingHours.start} - {route.operatingHours.end}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Stops ({route.stops.length}):</p>
                        <div className="space-y-1">
                          {route.stops.slice(0, 3).map((stop) => (
                            <div key={stop.stopId} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              {stop.stopName}
                            </div>
                          ))}
                          {route.stops.length > 3 && (
                            <p className="text-xs text-muted-foreground">+{route.stops.length - 3} more stops</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Active Buses:</span>
                        <span>{buses.filter((bus) => bus.routeId === route.routeId && bus.isActive).length}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

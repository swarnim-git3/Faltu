"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, NavigationIcon, AlertCircle } from "lucide-react"

// Mock bus tracking data
const mockBusData = {
  BUS001: {
    id: "BUS001",
    route: "City Center - Airport",
    currentLocation: "Main Street & 5th Ave",
    nextStop: "Central Station",
    estimatedArrival: "5 minutes",
    delay: 0,
    occupancy: 75,
    coordinates: { lat: 40.7128, lng: -74.006 },
    status: "On Time",
  },
  BUS002: {
    id: "BUS002",
    route: "Downtown - University",
    currentLocation: "University District",
    nextStop: "Campus Gate",
    estimatedArrival: "2 minutes",
    delay: 3,
    occupancy: 60,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    status: "Delayed",
  },
}

export default function TrackPage() {
  const [busNumber, setBusNumber] = useState("")
  const [trackedBus, setTrackedBus] = useState<any>(null)
  const [isTracking, setIsTracking] = useState(false)

  const handleTrackBus = () => {
    const bus = mockBusData[busNumber as keyof typeof mockBusData]
    if (bus) {
      setTrackedBus(bus)
      setIsTracking(true)
    } else {
      alert("Bus not found. Try BUS001 or BUS002")
    }
  }

  // Simulate real-time updates
  useEffect(() => {
    if (!isTracking || !trackedBus) return

    const interval = setInterval(() => {
      setTrackedBus((prev: any) => ({
        ...prev,
        estimatedArrival: Math.max(1, Number.parseInt(prev.estimatedArrival) - 1) + " minutes",
        occupancy: Math.min(100, prev.occupancy + Math.floor(Math.random() * 5) - 2),
      }))
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [isTracking, trackedBus])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Track Bus Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Track Your Bus
            </CardTitle>
            <CardDescription>Enter your bus number to track its real-time location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 max-w-md">
              <Input
                placeholder="Enter bus number (e.g., BUS001)"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
              />
              <Button onClick={handleTrackBus} className="bg-accent hover:bg-accent/90">
                Track
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackedBus && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bus Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="secondary">{trackedBus.id}</Badge>
                      <span>{trackedBus.route}</span>
                    </CardTitle>
                    <Badge variant={trackedBus.status === "On Time" ? "default" : "destructive"}>
                      {trackedBus.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="font-medium">Current Location:</span>
                    <span>{trackedBus.currentLocation}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <NavigationIcon className="h-4 w-4 text-accent" />
                    <span className="font-medium">Next Stop:</span>
                    <span>{trackedBus.nextStop}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="font-medium">Estimated Arrival:</span>
                    <span>{trackedBus.estimatedArrival}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span className="font-medium">Occupancy:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${trackedBus.occupancy}%` }}
                        />
                      </div>
                      <span className="text-sm">{trackedBus.occupancy}%</span>
                    </div>
                  </div>

                  {trackedBus.delay > 0 && (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Delayed by {trackedBus.delay} minutes</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Route Stops */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Stops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "City Center Terminal", status: "completed", time: "8:30 AM" },
                      { name: "Main Street & 5th Ave", status: "current", time: "8:45 AM" },
                      { name: "Central Station", status: "upcoming", time: "9:00 AM" },
                      { name: "Airport Terminal", status: "upcoming", time: "9:45 AM" },
                    ].map((stop, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            stop.status === "completed"
                              ? "bg-green-500"
                              : stop.status === "current"
                                ? "bg-accent animate-pulse"
                                : "bg-muted"
                          }`}
                        />
                        <div className="flex-1">
                          <div className={`font-medium ${stop.status === "current" ? "text-accent" : ""}`}>
                            {stop.name}
                          </div>
                          <div className="text-sm text-muted-foreground">{stop.time}</div>
                        </div>
                        {stop.status === "current" && <Badge variant="secondary">Current</Badge>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map View */}
            <Card>
              <CardHeader>
                <CardTitle>Live Map</CardTitle>
                <CardDescription>Real-time bus location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Simulated Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                    {/* Grid lines to simulate map */}
                    <div className="absolute inset-0 opacity-20">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i}>
                          <div
                            className="absolute border-t border-gray-300"
                            style={{ top: `${i * 10}%`, width: "100%" }}
                          />
                          <div
                            className="absolute border-l border-gray-300"
                            style={{ left: `${i * 10}%`, height: "100%" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bus Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-accent text-white p-3 rounded-full shadow-lg animate-pulse">
                      <NavigationIcon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Route Line */}
                  <div className="absolute inset-0">
                    <svg className="w-full h-full">
                      <path
                        d="M 50 400 Q 200 300 350 200 Q 400 150 450 100"
                        stroke="#6366f1"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="5,5"
                        className="opacity-60"
                      />
                    </svg>
                  </div>

                  {/* Stop Markers */}
                  <div className="absolute top-4 left-4 bg-green-500 w-3 h-3 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 bg-red-500 w-3 h-3 rounded-full"></div>

                  <div className="absolute bottom-4 left-4 text-xs bg-white/90 p-2 rounded">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Start</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Bus</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>End</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Coordinates: {trackedBus.coordinates.lat}, {trackedBus.coordinates.lng}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Last updated: Just now</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Track Options */}
        {!trackedBus && (
          <Card>
            <CardHeader>
              <CardTitle>Popular Routes</CardTitle>
              <CardDescription>Quick access to frequently tracked buses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.values(mockBusData).map((bus) => (
                  <Card key={bus.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{bus.id}</Badge>
                        <Badge variant={bus.status === "On Time" ? "default" : "destructive"}>{bus.status}</Badge>
                      </div>
                      <p className="font-medium mb-1">{bus.route}</p>
                      <p className="text-sm text-muted-foreground mb-3">{bus.currentLocation}</p>
                      <Button
                        size="sm"
                        className="w-full bg-accent hover:bg-accent/90"
                        onClick={() => {
                          setBusNumber(bus.id)
                          setTrackedBus(bus)
                          setIsTracking(true)
                        }}
                      >
                        Track This Bus
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

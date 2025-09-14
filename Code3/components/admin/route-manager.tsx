"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, Edit, Trash2, Navigation } from "lucide-react"

interface Route {
  routeId: string
  name: string
  stops: string[]
  distance: number
  estimatedTime: number
  activeBuses: number
}

export function RouteManager() {
  const [routes] = useState<Route[]>([
    {
      routeId: "ROUTE_A",
      name: "Downtown Express",
      stops: ["Central Station", "City Hall", "Shopping Mall", "University"],
      distance: 15.2,
      estimatedTime: 45,
      activeBuses: 2,
    },
    {
      routeId: "ROUTE_B",
      name: "Airport Shuttle",
      stops: ["Airport Terminal", "Hotel District", "Business Center"],
      distance: 22.8,
      estimatedTime: 60,
      activeBuses: 1,
    },
    {
      routeId: "ROUTE_C",
      name: "Suburban Loop",
      stops: ["Residential Area A", "School District", "Shopping Center", "Residential Area B"],
      distance: 18.5,
      estimatedTime: 55,
      activeBuses: 1,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Route Management</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Route
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routes.map((route) => (
          <Card key={route.routeId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    {route.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Route ID: {route.routeId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{route.activeBuses}</div>
                  <div className="text-xs text-muted-foreground">Active Buses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{route.distance}km</div>
                  <div className="text-xs text-muted-foreground">Distance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{route.estimatedTime}min</div>
                  <div className="text-xs text-muted-foreground">Est. Time</div>
                </div>
              </div>

              {/* Stops */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Stops ({route.stops.length})
                </h4>
                <div className="space-y-2">
                  {route.stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span>{stop}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Map
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

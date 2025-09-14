"use client"

import { useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Users, Zap } from "lucide-react"

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

interface RouteData {
  routeId: string
  routeName: string
  stops: Array<{
    stopId: string
    stopName: string
    coordinates: [number, number]
    estimatedTime: number
    order: number
  }>
}

interface BusMapProps {
  buses: BusData[]
  routes: RouteData[]
  onBusSelect: (busId: string) => void
}

export function BusMap({ buses, routes, onBusSelect }: BusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const [zoom, setZoom] = useState(12)

  const handleBusClick = (busId: string) => {
    setSelectedBus(busId)
    onBusSelect(busId)
  }

  const getBusColor = (bus: BusData) => {
    if (bus.busId === selectedBus) return "bg-accent"
    const occupancy = (bus.currentPassengers / bus.capacity) * 100
    if (occupancy >= 90) return "bg-destructive"
    if (occupancy >= 70) return "bg-yellow-500"
    return "bg-primary"
  }

  return (
    <div className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden">
      {/* Map Background */}
      <div
        ref={mapRef}
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-900"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(22, 78, 99, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(22, 78, 99, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 49%, rgba(229, 231, 235, 0.3) 50%, transparent 51%)
          `,
        }}
      >
        {/* Grid overlay for map-like appearance */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-border">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Bus Markers */}
        {buses.map((bus, index) => {
          const x = 20 + ((index * 25) % 80)
          const y = 20 + Math.floor(index / 3) * 30

          return (
            <div
              key={bus.busId}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                bus.busId === selectedBus ? "z-20 scale-125" : "z-10"
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              onClick={() => handleBusClick(bus.busId)}
            >
              {/* Bus Marker */}
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full ${getBusColor(bus)} shadow-lg border-2 border-background`}
              >
                <Navigation className="w-6 h-6 text-white" style={{ transform: `rotate(${bus.heading}deg)` }} />

                {/* Speed indicator */}
                {bus.speed > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <Zap className="w-2 h-2 text-accent-foreground" />
                  </div>
                )}
              </div>

              {/* Bus Info Popup */}
              {bus.busId === selectedBus && (
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-card border rounded-lg shadow-lg p-3 min-w-48 z-30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{bus.busId}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {routes.find((r) => r.routeId === bus.routeId)?.routeName || bus.routeId}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>
                        {bus.currentPassengers}/{bus.capacity} passengers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3 h-3" />
                      <span>{bus.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {bus.currentLocation.latitude.toFixed(4)}, {bus.currentLocation.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Occupancy indicator */}
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span>Occupancy</span>
                      <span className="font-medium">{Math.round((bus.currentPassengers / bus.capacity) * 100)}%</span>
                    </div>
                    <div className="mt-1 w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getBusColor(bus)}`}
                        style={{ width: `${(bus.currentPassengers / bus.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Route Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(22, 78, 99)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(22, 78, 99)" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Route paths */}
          <path
            d="M 20% 20% Q 40% 10% 60% 30% T 80% 50%"
            stroke="url(#routeGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            className="animate-pulse"
          />

          <path
            d="M 15% 60% Q 35% 40% 55% 60% T 85% 80%"
            stroke="url(#routeGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => setZoom(Math.min(zoom + 1, 18))}
          className="w-8 h-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          +
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setZoom(Math.max(zoom - 1, 8))}
          className="w-8 h-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          -
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card border rounded-lg p-3 shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Bus Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Available (&lt;70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Busy (70-90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span>Full (&gt;90%)</span>
          </div>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="absolute top-4 left-4">
        <Badge variant="default" className="flex items-center gap-1 animate-pulse bg-primary text-primary-foreground">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          Live Tracking
        </Badge>
      </div>
    </div>
  )
}

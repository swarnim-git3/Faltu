"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Navigation, Users, Clock, MapPin } from "lucide-react"

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

interface BusListProps {
  buses: BusData[]
  selectedBus: string | null
  onBusSelect: (busId: string) => void
  getCapacityStatus: (current: number, capacity: number) => { status: string; color: string }
}

export function BusList({ buses, selectedBus, onBusSelect, getCapacityStatus }: BusListProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="p-4 space-y-3">
        {buses.map((bus) => {
          const capacityInfo = getCapacityStatus(bus.currentPassengers, bus.capacity)
          const isSelected = bus.busId === selectedBus

          return (
            <div
              key={bus.busId}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50"
              }`}
              onClick={() => onBusSelect(bus.busId)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${capacityInfo.color}`} />
                  <h4 className="font-semibold text-sm">{bus.busId}</h4>
                  <Badge variant="outline" className="text-xs">
                    {bus.routeId}
                  </Badge>
                </div>
                {bus.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>
                    {bus.currentPassengers}/{bus.capacity}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span>{bus.speed} km/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(bus.currentLocation.timestamp)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Live</span>
                </div>
              </div>

              {/* Occupancy bar */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Occupancy</span>
                  <span className="font-medium">{Math.round((bus.currentPassengers / bus.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${capacityInfo.color}`}
                    style={{ width: `${(bus.currentPassengers / bus.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                    View Details
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

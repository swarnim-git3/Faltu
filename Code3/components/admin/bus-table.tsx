"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, MapPin, Users, Clock } from "lucide-react"

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
  driver?: string
  lastMaintenance?: string
  status: "active" | "maintenance" | "offline"
}

interface BusTableProps {
  buses: BusData[]
  onEdit: (busId: string) => void
  onDelete: (busId: string) => void
  getStatusColor: (status: string) => string
}

export function BusTable({ buses, onEdit, onDelete, getStatusColor }: BusTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "maintenance":
        return "Maintenance"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Bus Fleet Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bus ID</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Passengers</TableHead>
                <TableHead>Speed</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.busId}>
                  <TableCell className="font-medium">{bus.busId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{bus.routeId}</Badge>
                  </TableCell>
                  <TableCell>{bus.driver || "Unassigned"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(bus.status)}`} />
                      <span className="text-sm">{getStatusLabel(bus.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span>
                        {bus.currentPassengers}/{bus.capacity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={bus.speed > 0 ? "text-primary" : "text-muted-foreground"}>{bus.speed} km/h</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{bus.lastMaintenance ? formatDate(bus.lastMaintenance) : "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(bus.busId)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(bus.busId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

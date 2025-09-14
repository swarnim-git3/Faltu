"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Navigation, Users, MapPin, Plus, BarChart3, AlertTriangle } from "lucide-react"
import { BusTable } from "./bus-table"
import { RouteManager } from "./route-manager"
import { Analytics } from "./analytics"
import { AddBusDialog } from "./add-bus-dialog"

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

export function BusManagement() {
  const [buses, setBuses] = useState<BusData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    // Mock data with additional admin fields
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
        driver: "John Smith",
        lastMaintenance: "2024-01-15",
        status: "active",
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
        driver: "Sarah Johnson",
        lastMaintenance: "2024-01-20",
        status: "active",
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
        currentPassengers: 0,
        isActive: false,
        speed: 0,
        heading: 270,
        driver: "Mike Wilson",
        lastMaintenance: "2024-01-10",
        status: "maintenance",
      },
    ]

    setTimeout(() => {
      setBuses(mockBuses)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary"
      case "maintenance":
        return "bg-yellow-500"
      case "offline":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const activeBuses = buses.filter((bus) => bus.status === "active").length
  const maintenanceBuses = buses.filter((bus) => bus.status === "maintenance").length
  const totalPassengers = buses.reduce((sum, bus) => sum + bus.currentPassengers, 0)
  const averageOccupancy =
    buses.length > 0 ? Math.round((totalPassengers / buses.reduce((sum, bus) => sum + bus.capacity, 0)) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Settings className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Bus Management</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard - Code on Wheels</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Bus
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeBuses}</div>
              <p className="text-xs text-muted-foreground">{buses.length - activeBuses} offline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{maintenanceBuses}</div>
              <p className="text-xs text-muted-foreground">Buses in service</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalPassengers}</div>
              <p className="text-xs text-muted-foreground">Currently onboard</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{averageOccupancy}%</div>
              <p className="text-xs text-muted-foreground">Fleet average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="buses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="buses" className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Bus Fleet
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Routes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buses">
            <BusTable
              buses={buses}
              onEdit={(busId) => console.log("Edit bus:", busId)}
              onDelete={(busId) => console.log("Delete bus:", busId)}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="routes">
            <RouteManager />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics buses={buses} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Bus Dialog */}
      <AddBusDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={(busData) => {
          console.log("Adding bus:", busData)
          setShowAddDialog(false)
        }}
      />
    </div>
  )
}

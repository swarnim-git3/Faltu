"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Ticket, Download, RefreshCw, AlertCircle } from "lucide-react"

// Mock booking data
const mockBookings = {
  upcoming: [
    {
      id: "TKT001",
      busId: "BUS001",
      route: "City Center - Airport",
      date: "2024-01-15",
      time: "08:30 AM",
      seat: "A12",
      price: 25,
      status: "Confirmed",
      boardingPoint: "City Center Terminal",
      destination: "Airport Terminal",
    },
    {
      id: "TKT002",
      busId: "BUS003",
      route: "Mall - Business District",
      date: "2024-01-18",
      time: "10:00 AM",
      seat: "B05",
      price: 12,
      status: "Confirmed",
      boardingPoint: "Shopping Mall",
      destination: "Business District",
    },
  ],
  completed: [
    {
      id: "TKT003",
      busId: "BUS002",
      route: "Downtown - University",
      date: "2024-01-10",
      time: "09:15 AM",
      seat: "C08",
      price: 15,
      status: "Completed",
      boardingPoint: "Downtown Station",
      destination: "University Campus",
    },
  ],
  cancelled: [
    {
      id: "TKT004",
      busId: "BUS001",
      route: "City Center - Airport",
      date: "2024-01-12",
      time: "08:30 AM",
      seat: "A15",
      price: 25,
      status: "Cancelled",
      boardingPoint: "City Center Terminal",
      destination: "Airport Terminal",
      refundAmount: 22.5,
    },
  ],
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "default"
      case "Completed":
        return "secondary"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleDownloadTicket = (ticketId: string) => {
    // In a real app, this would generate and download a PDF ticket
    alert(`Downloading ticket ${ticketId}...`)
  }

  const handleCancelBooking = (ticketId: string) => {
    // In a real app, this would make an API call to cancel the booking
    alert(`Cancelling booking ${ticketId}...`)
  }

  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">{booking.id}</CardTitle>
            <Badge variant="secondary">{booking.busId}</Badge>
          </div>
          <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>
        <CardDescription>{booking.route}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{booking.boardingPoint}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Seat:</span> {booking.seat}
            </div>
            <div className="text-sm">
              <span className="font-medium">Price:</span> ${booking.price}
            </div>
            {booking.refundAmount && (
              <div className="text-sm text-green-600">
                <span className="font-medium">Refund:</span> ${booking.refundAmount}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {booking.status === "Confirmed" && (
            <>
              <Button size="sm" onClick={() => handleDownloadTicket(booking.id)}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleCancelBooking(booking.id)}>
                Cancel
              </Button>
            </>
          )}
          {booking.status === "Completed" && (
            <Button size="sm" variant="outline" onClick={() => handleDownloadTicket(booking.id)}>
              <Download className="h-4 w-4 mr-1" />
              Download Receipt
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your bus tickets and travel history</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{mockBookings.upcoming.length}</div>
                  <div className="text-sm text-muted-foreground">Upcoming Trips</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{mockBookings.completed.length}</div>
                  <div className="text-sm text-muted-foreground">Completed Trips</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <div className="text-2xl font-bold">{mockBookings.cancelled.length}</div>
                  <div className="text-sm text-muted-foreground">Cancelled Trips</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {mockBookings.upcoming.length > 0 ? (
              mockBookings.upcoming.map(renderBookingCard)
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Trips</h3>
                  <p className="text-muted-foreground mb-4">You don't have any upcoming bus bookings.</p>
                  <Button className="bg-accent hover:bg-accent/90">Book a Trip</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {mockBookings.completed.length > 0 ? (
              mockBookings.completed.map(renderBookingCard)
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Trips</h3>
                  <p className="text-muted-foreground">Your completed trips will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            {mockBookings.cancelled.length > 0 ? (
              mockBookings.cancelled.map(renderBookingCard)
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Cancelled Trips</h3>
                  <p className="text-muted-foreground">Your cancelled bookings will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

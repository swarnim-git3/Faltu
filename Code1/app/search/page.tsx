"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, ArrowRight } from "lucide-react"

// Mock data for demonstration
const mockBuses = [
  {
    id: "BUS001",
    route: "City Center - Airport",
    departure: "08:30 AM",
    arrival: "09:45 AM",
    duration: "1h 15m",
    price: 25,
    seatsAvailable: 12,
    operator: "Metro Express",
    amenities: ["WiFi", "AC", "USB Charging"],
  },
  {
    id: "BUS002",
    route: "Downtown - University",
    departure: "09:15 AM",
    arrival: "10:00 AM",
    duration: "45m",
    price: 15,
    seatsAvailable: 8,
    operator: "City Transit",
    amenities: ["AC", "USB Charging"],
  },
  {
    id: "BUS003",
    route: "Mall - Business District",
    departure: "10:00 AM",
    arrival: "10:30 AM",
    duration: "30m",
    price: 12,
    seatsAvailable: 20,
    operator: "Quick Ride",
    amenities: ["WiFi", "AC"],
  },
]

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState(mockBuses)
  const [selectedBus, setSelectedBus] = useState<string | null>(null)

  const handleSearch = () => {
    // In a real app, this would make an API call
    setSearchResults(mockBuses)
  }

  const handleBookNow = (busId: string) => {
    setSelectedBus(busId)
    // In a real app, this would navigate to booking page
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Search Buses
            </CardTitle>
            <CardDescription>Find the perfect bus for your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input id="from" placeholder="Departure city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input id="to" placeholder="Destination city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passengers">Passengers</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Passenger</SelectItem>
                    <SelectItem value="2">2 Passengers</SelectItem>
                    <SelectItem value="3">3 Passengers</SelectItem>
                    <SelectItem value="4">4+ Passengers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSearch} className="mt-4 bg-accent hover:bg-accent/90">
              Search Buses
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available Buses</h2>

          {searchResults.map((bus) => (
            <Card key={bus.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Bus Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{bus.id}</Badge>
                      <span className="font-semibold text-lg">{bus.operator}</span>
                    </div>
                    <p className="text-muted-foreground mb-2">{bus.route}</p>

                    {/* Time Info */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-accent" />
                        <span className="font-medium">{bus.departure}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-accent" />
                        <span className="font-medium">{bus.arrival}</span>
                      </div>
                      <Badge variant="outline">{bus.duration}</Badge>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1">
                      {bus.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Booking */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">${bus.price}</div>
                      <div className="text-sm text-muted-foreground">per person</div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{bus.seatsAvailable} seats left</span>
                    </div>

                    <Button onClick={() => handleBookNow(bus.id)} className="bg-primary hover:bg-primary/90">
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Modal/Section */}
        {selectedBus && (
          <Card className="mt-8 border-accent">
            <CardHeader>
              <CardTitle className="text-accent">Booking Details</CardTitle>
              <CardDescription>Complete your booking for {selectedBus}</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm busId={selectedBus} onClose={() => setSelectedBus(null)} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function BookingForm({ busId, onClose }: { busId: string; onClose: () => void }) {
  const [step, setStep] = useState(1)

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber ? "bg-accent text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && <div className={`w-12 h-0.5 ${step > stepNumber ? "bg-accent" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Passenger Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Seat Selection</h3>
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {Array.from({ length: 20 }, (_, i) => (
              <Button key={i + 1} variant={i === 5 ? "default" : "outline"} size="sm" className="aspect-square">
                {i + 1}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">Selected: Seat 6 • $25.00</p>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={step === 1 ? onClose : () => setStep(step - 1)}>
          {step === 1 ? "Cancel" : "Previous"}
        </Button>
        <Button
          onClick={step === 3 ? () => alert("Booking confirmed!") : () => setStep(step + 1)}
          className="bg-accent hover:bg-accent/90"
        >
          {step === 3 ? "Complete Booking" : "Next"}
        </Button>
      </div>
    </div>
  )
}

import { Navigation } from "@/components/navigation"
import { RealTimeUpdates } from "@/components/real-time-updates"
import { LiveStatusBar } from "@/components/live-status-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Clock, Shield, Smartphone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Track Your Bus in <span className="text-accent">Real-Time</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Never miss your bus again. Book tickets, track live locations, and get real-time updates for a seamless
            travel experience.
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input placeholder="Enter bus number or route..." className="flex-1" />
              <Button className="bg-accent hover:bg-accent/90">Track Now</Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Book a Ticket
            </Button>
            <Button size="lg" variant="outline">
              View Routes
            </Button>
          </div>
        </div>
      </section>

      {/* Live Status Bar */}
      <section className="px-4">
        <div className="container mx-auto">
          <LiveStatusBar />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BusTracker?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Real-Time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Track your bus location live on the map with accurate GPS data</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Live Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Get instant notifications about delays, arrivals, and route changes</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Secure Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Book tickets securely with multiple payment options and instant confirmation
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Mobile Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Access all features on any device with our responsive design</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust BusTracker for their daily commute and long-distance travel.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 BusTracker. All rights reserved.</p>
        </div>
      </footer>

      {/* Real-time Updates Component */}
      <RealTimeUpdates />
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface AddBusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (busData: any) => void
}

export function AddBusDialog({ open, onOpenChange, onAdd }: AddBusDialogProps) {
  const [formData, setFormData] = useState({
    busId: "",
    routeId: "",
    capacity: "",
    driver: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      onAdd({
        ...formData,
        capacity: Number.parseInt(formData.capacity),
        currentLocation: {
          latitude: 40.7128,
          longitude: -74.006,
          timestamp: new Date().toISOString(),
        },
        currentPassengers: 0,
        isActive: true,
        speed: 0,
        heading: 0,
        status: "active",
        lastMaintenance: new Date().toISOString().split("T")[0],
      })
      setLoading(false)
      setFormData({ busId: "", routeId: "", capacity: "", driver: "" })
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Bus</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="busId">Bus ID</Label>
            <Input
              id="busId"
              placeholder="e.g., BUS004"
              value={formData.busId}
              onChange={(e) => handleInputChange("busId", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="routeId">Route</Label>
            <Select
              value={formData.routeId}
              onValueChange={(value) => handleInputChange("routeId", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROUTE_A">Route A - Downtown Express</SelectItem>
                <SelectItem value="ROUTE_B">Route B - Airport Shuttle</SelectItem>
                <SelectItem value="ROUTE_C">Route C - Suburban Loop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g., 50"
              value={formData.capacity}
              onChange={(e) => handleInputChange("capacity", e.target.value)}
              required
              disabled={loading}
              min="1"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver">Driver Name</Label>
            <Input
              id="driver"
              placeholder="e.g., John Doe"
              value={formData.driver}
              onChange={(e) => handleInputChange("driver", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.busId || !formData.routeId || !formData.capacity}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Bus"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

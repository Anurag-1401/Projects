import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { useData } from "@/hooks/DataContext"
import WingsDialog from "./WingsDialog"

export default function HostelsDialog({ open, onClose }) {
  const { hostels } = useData()
  const [selectedHostel, setSelectedHostel] = useState(null)

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Hostel</DialogTitle>
          </DialogHeader>
 
          {hostels.map((h) => {
            const totalRooms =
              h.total_wings_per_hostel *
              h.total_floors_per_wing *
              h.total_rooms_per_floor_per_wing
      return (
            <div
              key={h.id}
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedHostel(h)}
            >
              {h.name} ({totalRooms} rooms)
            </div>
      )
    })}
        </DialogContent>
      </Dialog>

      {/* LEVEL 2 */}
      <WingsDialog
        hostel={selectedHostel}
        open={!!selectedHostel}
        onClose={() => setSelectedHostel(null)}
      />
    </>
  )
}
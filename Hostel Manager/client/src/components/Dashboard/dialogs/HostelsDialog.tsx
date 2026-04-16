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

          {hostels.map((h) => (
            <div
              key={h.id}
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedHostel(h)}
            >
              {h.name} ({h.totalRooms} rooms)
            </div>
          ))}
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
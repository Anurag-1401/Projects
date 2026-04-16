import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useData } from "@/hooks/DataContext"
import { useState } from "react"
import WingsDialog from "./WingsDialog"
import { groupAttendanceByHostel } from "@/hooks/grouping"

export default function AttendanceDialog({ open, onClose }) {
  const { attendance, hostels } = useData()
  const [selectedHostel, setSelectedHostel] = useState(null)

  const grouped = groupAttendanceByHostel(attendance, hostels)

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance by Hostel</DialogTitle>
          </DialogHeader>

          {Object.keys(grouped).map((hostel) => (
            <div
              key={hostel}
              className="p-3 border rounded cursor-pointer"
              onClick={() => setSelectedHostel(hostel)}
            >
              {hostel} ({grouped[hostel].length} present)
            </div>
          ))}
        </DialogContent>
      </Dialog>

      <WingsDialog
        hostel={selectedHostel}
        open={!!selectedHostel}
        onClose={() => setSelectedHostel(null)}
      />
    </>
  )
}
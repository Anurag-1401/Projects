import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { useData } from "@/hooks/DataContext"
import { groupStudentsByHostel } from "@/hooks/grouping"
import WingsDialog from "./WingsDialog"


export default function StudentsDialog({ open, onClose }) {
  const { students ,hostels} = useData()
  const [selectedHostel, setSelectedHostel] = useState(null)

  const grouped = groupStudentsByHostel(students, hostels)

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Students by Hostel</DialogTitle>
          </DialogHeader>

          {Object.keys(grouped).map((hostel) => (
            <div
              key={hostel}
              className="p-3 border rounded cursor-pointer"
              onClick={() => setSelectedHostel(hostel)}
            >
              {hostel} ({grouped[hostel].length})
            </div>
          ))}
        </DialogContent>
      </Dialog>

      {/* Reuse WingsDialog */}
      <WingsDialog
        hostel={selectedHostel}
        open={!!selectedHostel}
        onClose={() => setSelectedHostel(null)}
      />
    </>
  )
}
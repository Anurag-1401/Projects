import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"

export default function WingsDialog({ hostel, open, onClose }) {
  const navigate = useNavigate()

  if (!hostel) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hostel.name} - Wings</DialogTitle>
        </DialogHeader>

        <div
          className="p-3 border rounded cursor-pointer hover:bg-gray-50 font-semibold bg-blue-50"
          onClick={() => navigate(`/rooms/${hostel.id}/ALL`)}
        >
          View Full Hostel
        </div>

       {Array.from({ length: hostel.total_wings_per_hostel }, (_, i) => {
          const wingName = String.fromCharCode(65 + i) // A, B, C...
              
          return (
            <div
              key={i}
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/rooms/${hostel.id}/${wingName}`)}
            >
              Wing {wingName} 
              <span className="text-xs text-gray-500 ml-2">
                Floors: {hostel.total_floors_per_wing}
              </span>
            </div>
          )
        })}
      </DialogContent>
    </Dialog>
  )
}
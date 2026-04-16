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

        {hostel.wings.map((wing) => (
          <div
            key={wing.id}
            className="p-3 border rounded cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/rooms/${hostel.id}/${wing.id}`)}
          >
            {wing.name} (Floors: {wing.floors})
          </div>
        ))}
      </DialogContent>
    </Dialog>
  )
}
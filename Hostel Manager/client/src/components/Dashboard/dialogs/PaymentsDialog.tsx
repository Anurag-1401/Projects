import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useData } from "@/hooks/DataContext"

export default function PaymentsDialog({ open, onClose }) {
  const { students } = useData()

  const overdue = students.filter(s => s.feesDue)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Overdue Payments</DialogTitle>
        </DialogHeader>

        {overdue.map((s) => (
          <div key={s.id} className="p-3 border rounded">
            <p>{s.name}</p>
            <p className="text-red-500 text-sm">Due: {s.feesDue}</p>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  )
}
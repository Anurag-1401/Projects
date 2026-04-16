import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ViewLeaveDialog({
  open,
  setOpen,
  selectedApplication,
  remarks,
  setRemarks,
  handleStatusUpdate,
  calculateDays,
  userRole
}) {

  if (!selectedApplication) return null
  console.log("Selected Application:", selectedApplication)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        
        <DialogHeader>
          <DialogTitle>Leave Application Details</DialogTitle>
          <DialogDescription>
            Review and update leave application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          {/* 🔹 Details */}
          <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20">

            <div className="grid grid-cols-2 gap-4 mb-4">
              
              <div>
                <label className="text-sm text-gray-600">Student</label>
                <p className="font-medium text-gray-400">{selectedApplication.student}</p>
                <p className="text-sm text-gray-400">
                  Room No: {selectedApplication.roomNo}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Duration</label>
                <p className="font-medium text-gray-400">
                  {calculateDays(
                    selectedApplication.start_date,
                    selectedApplication.end_date
                  )} days
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedApplication.start_date).toLocaleDateString()} -{" "}
                  {new Date(selectedApplication.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Reason</label>
              <p className="mt-1 text-gray-400">{selectedApplication.reason}</p>
            </div>

            <div className="text-sm text-gray-600 flex gap-4 flex-wrap">
              <span>
                Applied: {new Date(selectedApplication.createdAt).toLocaleDateString()}
              </span>
              <span>Status: {selectedApplication.status}</span>
              <span>Stage: {selectedApplication.current_level}</span>
            </div>
          </div>

          {/* 🔹 Remarks */}
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks..."
              rows={3}
            />
          </div>

          {/* 🔹 Actions */}
          <div className="flex justify-end gap-2">

            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>

            {/* 🔥 ROLE BASED BUTTONS */}
            {selectedApplication.status === "pending" &&
              ((selectedApplication.current_level === "coordinator" && userRole === "coordinator") ||
               (selectedApplication.current_level === "warden" &&
                (userRole === "warden" || userRole === "admin"))) && (
              <>
                <Button
                  onClick={() => handleStatusUpdate(selectedApplication.id, "rejected")}
                  variant="destructive"
                >
                  Reject
                </Button>

                <Button
                  onClick={() => handleStatusUpdate(selectedApplication.id, "approved")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
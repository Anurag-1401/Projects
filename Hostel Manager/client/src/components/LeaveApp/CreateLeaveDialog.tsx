import { useState } from "react"
import axios from "axios"
import { toast } from "@/hooks/use-toast"

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogTrigger
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, AlertTriangle } from "lucide-react"

export function CreateLeaveDialog({ refetch }: { refetch: () => void }) {

  const baseURL = import.meta.env.VITE_BACKEND_URL

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    reason: "",
    start_date: "",
    end_date: "",
  })

  const student = JSON.parse(localStorage.getItem("User"))

  const resetForm = () => {
    setFormData({
      reason: "",
      start_date: "",
      end_date: "",
    })
    setError("")
    setSuccess("")
  }

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const today = new Date()
    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)

    today.setHours(0, 0, 0, 0)

    if (start < today || end < today) {
      toast({ title: "Dates cannot be in the past", variant: "destructive" })
      return
    }

    try {
      const res = await axios.post(`${baseURL}/leave/add-leave`, {
        ...formData,
        studentId: student?.student_details.id
      })

      if (res.status === 201) {
        toast({ title: "Application sent" })
        refetch()
        resetForm()
        setIsAddDialogOpen(false)
      }
    } catch (err) {
      setError("Failed to submit")
    }
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Leave Application</DialogTitle>
              <DialogDescription>
                Submit a leave application on behalf of a student
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              {formData.start_date && formData.end_date && (
                <div className="text-sm text-gray-600">
                  Duration: {calculateDays(formData.start_date, formData.end_date)} day(s)
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Please provide detailed reason for leave..."
                  rows={4}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsAddDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Application</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
  )
}
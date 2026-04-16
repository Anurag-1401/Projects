import { useState} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/hooks/DataContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Search, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  CalendarDays,
  AlertTriangle
} from 'lucide-react'

import axios from 'axios'
import { toast } from '@/hooks/use-toast';
import { CreateLeaveDialog } from "@/components/LeaveApp/CreateLeaveDialog"
import { ViewLeaveDialog } from "@/components/LeaveApp/viewLeaveDialog"

export function LeaveApplications(): JSX.Element {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const {applications,loading ,refetchAll} = useData();

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [remarks, setRemarks] = useState('')
  
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const student = JSON.parse(localStorage.getItem('User'))
  const adminData = JSON.parse(localStorage.getItem("adminCreds"));
  const userRole = adminData?.role; 


  const handleStatusUpdate = async (Id: number, status: string): Promise<void> => {
    try {
      const response = await axios.put(`${baseURL}/leave/edit-leave/${Id}`,{status,response:remarks,approvedBy:adminData.Email})

      if (response.status == 200) {
        setSuccess('Application updated successfully')
        toast({
          title:"Application updated"
        })
        refetchAll.application()
        setIsViewDialogOpen(false)
        setSelectedApplication(null)
        setRemarks('')
      } 
    } catch (error) {
      setError('Application tupdate error. Please try again.')
      console.error('Application update error:', error)
    }
  }

  const openViewDialog = (application): void => {
    setSelectedApplication(application)
    setRemarks(application.remarks || '')
    setIsViewDialogOpen(true)
  }

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const thisApplications = student ? applications.filter(ap => ap.student === student?.student_details.name) : 
          (userRole === "coordinator" ? applications.filter(ap => ap.current_level === "coordinator") : 
          (userRole === "warden" ? applications.filter(ap => ap.current_level === "warden") : applications))

  const filteredApplications = thisApplications.filter(application => {
    const matchesSearch = application.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter

    let matchesDate = true
  if(selectedDate){
     const attendanceDate = new Date(application.createdAt).toISOString().split('T')[0]
    matchesDate = attendanceDate === selectedDate
  }

    return matchesSearch && matchesStatus && matchesDate
  })


  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const stats = {
    total: filteredApplications.length,
    pending: filteredApplications.filter(a => a.status === 'pending').length,
    approved: filteredApplications.filter(a => a.status === 'approved').length,
    rejected: filteredApplications.filter(a => a.status === 'rejected').length,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Leave Applications</h2>
        {student && (
          <CreateLeaveDialog refetch={refetchAll.application} />
        )}
      </div>

      {(success || error) && (
        <Alert variant={error ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{success || error}</AlertDescription>
        </Alert>
      )}

<div className="flex flex-wrap justify-between gap-4 bg-gray-100 p-5">
  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
      <div className="text-sm text-gray-600">Total Complaints</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
      <div className="text-sm text-gray-600">Pending</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
      <div className="text-sm text-gray-600">Approved</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
      <div className="text-sm text-gray-600">Rejected</div>
    </CardContent>
  </Card>
</div>


<Card>
  <CardContent className="p-4">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="w-full md:w-[180px]">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-[180px]">
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
    </div>
  </CardContent>
</Card>


      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>Review and manage student leave applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Leave Details</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{application.student}</div>
                        <div className="text-sm text-gray-500">
                          Room No: {application.roomNo}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {new Date(application.start_date).toLocaleDateString()} - {new Date(application.end_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {application.reason}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        <span>{calculateDays(application.start_date, application.end_date)} days</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {application.current_level === "coordinator"
                        ? "Coordinator Review"
                        : "Warden Review"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                   
                   <TableCell>
                    {student ? (
                      // 🔹 STUDENT VIEW
                      <div className="text-sm text-gray-300">
                      
                        {/* Pending */}
                        {application.status === "pending" && (
                          <div className="flex flex-col space-y-1">
                            <span className="text-yellow-400">
                              Waiting for {application.current_level}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {application.response}
                            </span>
                          </div>
                        )}
                  
                        {/* Approved */}
                        {application.status === "approved" && (
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-1 text-green-400">
                              {getStatusIcon(application.status)}
                              <span>Approved</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              By: {application.approved_by}
                            </span>
                            <span className="text-xs text-gray-400">
                              On: {new Date(application.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                  
                        {/* Rejected */}
                        {application.status === "rejected" && (
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-1 text-red-400">
                              {getStatusIcon(application.status)}
                              <span>Rejected</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {application.response}
                            </span>
                            <span className="text-xs text-gray-400">
                              By: {application.approved_by}
                            </span>
                            <span className="text-xs text-gray-400">
                              On: {new Date(application.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                  
                    ) : (
                      // 🔹 ADMIN / COORDINATOR VIEW
                      <div className="flex flex-col space-y-2">
                      
                        {/* Pending → show actions ONLY if correct level */}
                        {application.status === "pending" ? (
                          <>
                            <div className="text-xs text-gray-400">
                              Current: {application.current_level}
                            </div>
                        
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openViewDialog(application)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                        
                              {/* ✅ Allow action based on level */}
                              {((application.current_level === "coordinator" && userRole === "coordinator") ||
                                (application.current_level === "warden" && userRole === "warden")) && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(application.id, "approved")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve
                                  </Button>
                                
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(application.id, "rejected")}
                                    variant="destructive"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </>
                        ) : (
                          // Final state
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(application.status)}
                              <span>{application.status}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              By: {application.approved_by}
                            </span>
                            <span className="text-xs text-gray-400">
                              On: {new Date(application.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredApplications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No leave applications found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ViewLeaveDialog
        open={isViewDialogOpen}
        setOpen={setIsViewDialogOpen}
        selectedApplication={selectedApplication}
        remarks={remarks}
        setRemarks={setRemarks}
        handleStatusUpdate={handleStatusUpdate}
        calculateDays={calculateDays}
        userRole={userRole}
      />
    </div>
  )
}

import { useState} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/hooks/DataContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Search, 
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  Eye,
} from 'lucide-react'
import axios from 'axios'
import { toast } from '@/hooks/use-toast';



export function ComplaintSystem(): JSX.Element {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const {complaints,loading ,refetchAll} = useData();

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState<boolean>(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [res, setResponse] = useState('')
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    category: 'accommodation',
    priority: 'medium',
  })
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const student = JSON.parse(localStorage.getItem('User'))


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(`${baseURL}/complaint/add-complaint`, {...formData,student_id:student?.student_details.id} )

      if (response.status === 201) {
        console.log("Complaint Added",response)
        setSuccess('Complaint added successfully')
        refetchAll.complaints()
        resetForm()
        setIsAddDialogOpen(false)
        toast({
          title:"Complaint Added"
        })
      } else {
        setError('Failed to add complaint')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Complaint adding error:', error)
    }
  }


  const handleStatusUpdate = async (complaintId: Number, status: string): Promise<void> => {
    try {
      const response = await axios.put(`${baseURL}/complaint/edit-complaint/${complaintId}`,{status,res,resolvedBy:JSON.parse(localStorage.getItem('adminCreds'))?.Email})

      if (response.status == 200) {
        setSuccess('Complaint updated successfully')
        toast({
          title:"complaint updated"
        })
        refetchAll.complaints()
        setIsResponseDialogOpen(false)
        setSelectedComplaint(null)
        setResponse('')
      } 
    } catch (error) {
      setError('Complaint update error. Please try again.')
      console.error('Complaint update error:', error)
    }
  }

  const resetForm = (): void => {
    setFormData({
      student_id: '',
      title: '',
      description: '',
      category: 'accommodation',
      priority: 'medium',
    })
    setError('')
    setSuccess('')
  }

  const openResponseDialog = (complaint): void => {
    setSelectedComplaint(complaint)
    setIsResponseDialogOpen(true)
  }

  const thisComplaints = student ? complaints.filter(cm => cm.student_name === student?.student_details.name) : complaints
  const filteredComplaints = thisComplaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.student_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'in-progress': return <MessageCircle className="h-4 w-4 text-blue-600" />
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'closed': return <CheckCircle className="h-4 w-4 text-gray-600" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const stats = {
    total: filteredComplaints.length,
    pending: filteredComplaints.filter(c => c.status === 'pending').length,
    inProgress: filteredComplaints.filter(c => c.status === 'in-progress').length,
    resolved: filteredComplaints.filter(c => c.status === 'resolved').length,
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
        <h2 className="text-2xl font-bold text-gray-900">Complaint Management</h2>
        {student && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit New Complaint</DialogTitle>
              <DialogDescription>
                Submit a complaint to solve
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="behavior">Behavior</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="What kind of complaint"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
               
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the complaint..."
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
                <Button type="submit">Submit Complaint</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
      <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
      <div className="text-sm text-gray-600">In Progress</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
      <div className="text-sm text-gray-600">Resolved</div>
    </CardContent>
  </Card>
</div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="behavior">Behavior</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints ({filteredComplaints.length})</CardTitle>
          <CardDescription>Manage and respond to student complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complaint Details</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{complaint.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {complaint.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{complaint.student_name}</div>
                        <div className="text-sm text-gray-500">
                          Room No: {complaint.room_no}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {complaint.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(complaint.priority)}>
                        {complaint.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell>
                     {student ? (
                        <div className="text-sm text-gray-500">
                        {complaint.status !== 'resolved' ? (
                          <>
                          {complaint.response}
                          {complaint.status === 'in-progress' && (
                           <div className="flex flex-col mt-2 space-y-1">
                             <span >By: {complaint.resolvedBy}</span>
                             <span>
                             On: {new Date(complaint.updatedAt).toLocaleDateString()}
                           </span>
                           </div>
                         )}
                          </>
                        ):(
                          <>
                          {getStatusIcon(complaint.status)}
                          <div className="flex flex-col mt-2 space-y-1">
                             <span >By: {complaint.resolvedBy}</span>
                             <span>
                             On: {new Date(complaint.updatedAt).toLocaleDateString()}
                           </span>
                           </div>
                          </>
                        )}
                        
                      </div>
                     ): (
                      <div className="flex space-x-2">
                        
                      {complaint.status !== 'resolved' ? (
                        <>
                       {complaint.status !== 'in-progress' && (
                         <>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openResponseDialog(complaint)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(complaint.id, 'in-progress')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Process
                          </Button>
                        </>  
                        )}
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Resolve
                          </Button>
                        </>

                      ):(
                        <div className='flex flex-col mt-2'>
                        {getStatusIcon(complaint.status)}
                        <div className="flex flex-col mt-2 space-y-1">
                         <span >By:{complaint.resolvedBy}</span>
                         <span> On: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                       </div>
                     </div>
                      )}
                    </div>
                     )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredComplaints.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No complaints found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complaint Details & Response</DialogTitle>
            <DialogDescription>
              View and respond to complaint
            </DialogDescription>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-medium mb-2">{selectedComplaint.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedComplaint.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Student: {selectedComplaint.student_name}</span>
                  <span>Category: {selectedComplaint.category}</span>
                  <span>Priority: {selectedComplaint.priority}</span>
                  <span>Date: {new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Response</Label>
                <Textarea
                  id="response"
                  value={res}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Enter your response to the complaint..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsResponseDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedComplaint.id, 'in-progress')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Mark In Progress
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedComplaint.id, 'resolved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark Resolved
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
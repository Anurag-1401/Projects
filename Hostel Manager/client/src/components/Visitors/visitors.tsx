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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Search, 
  Clock,
  CheckCircle,
  User,
  Phone,
  Calendar,
  LogOut,
  AlertTriangle
} from 'lucide-react'
import axios from 'axios'
import { toast } from '@/hooks/use-toast';


export function VisitorManagement(): JSX.Element {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const {visitors,students,refetchAll,loading} = useData()

  const [assign, setAssign] = useState([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)

  function getISTTime() {
    const now = new Date();
    const istOffset = 330; 
    const istTime = new Date(now.getTime() + istOffset * 60 * 1000);
  
    return istTime.toISOString().slice(0, 19).replace("T", " "); 
  }
  
  const [formData, setFormData] = useState({
    student_email: "",
    visitor_name: '',
    visitor_phone: '',
    check_in: getISTTime(),
  })
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(`${baseURL}/visitors/add-visitor`, formData )

      if (response.status === 201) {
        console.log("Visitor Added",response)
        setSuccess('Visitor checked in successfully')
        refetchAll()
        resetForm()
        setIsAddDialogOpen(false)
        toast({
          title:"Visitors Checked-In"
        })
      } else {
        setError('Failed to check in visitor')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Visitor check-in error:', error)
    }
  }

  const handleCheckOut = async (visitorId: Number): Promise<void> => {
    try {
      const response = await axios.put(`${baseURL}/visitors/edit-visitor/${visitorId}`,{
        check_out:getISTTime()
      } )

      if (response.status === 200) {
        console.log("Visitor Edited",response)
        setSuccess('Visitor checked out successfully')
        refetchAll()
        resetForm()
        setIsAddDialogOpen(false)
        toast({
          title:"Visitors Checked-Out"
        })
      } else {
        setError('Failed to check out visitor')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Visitor check-out error:', error)
    }
  }

  const resetForm = (): void => {
    setFormData({
      student_email: "",
      visitor_name: '',
      visitor_phone: '',
      check_in: getISTTime(),
    })
    setError('')
    setSuccess('')
  }

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter === 'checked-in') {
      matchesStatus = visitor.check_out === null
    } else if (statusFilter === 'checked-out') {
      matchesStatus = visitor.check_out !== null
    }
    
    let matchesDate = true
    if (dateFilter) {
      const visitorDate = new Date(visitor.check_in).toISOString().split('T')[0]
      matchesDate = visitorDate === dateFilter
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const calculateDuration = (checkIn: string, checkOut: string | null): string => {
    const start = new Date(checkIn)
    const end = checkOut ? new Date(checkOut) : new Date()
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes}m`
  }

  const getStatusColor = (checkOut: string | null): string => {
    return checkOut ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
  }

  const stats = {
    total: filteredVisitors.length,
    checkedIn: filteredVisitors.filter(v => v.check_out === null).length,
    checkedOut: filteredVisitors.filter(v => v.check_out !== null).length,
    today: filteredVisitors.filter(v => {
      const today = new Date().toISOString().split('T')[0]
      const visitorDate = new Date(v.check_in).toISOString().split('T')[0]
      return visitorDate === today
    }).length,
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
        <h2 className="text-2xl font-bold text-gray-900">Visitor Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Check In Visitor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Visitor Check-In</DialogTitle>
              <DialogDescription>
                Register a new visitor and check them in
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Visiting Student *</Label>
                  <Select
                    value={formData.student_email || ""}
                    onValueChange={(value) => setFormData({ ...formData, student_email: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.email} value={student.email}>
                          {student.name} 
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* <Input list='data'
                  placeholder='Student Name'
                />

                <datalist id='data'>
                  {students.map(student => (
                    <option value={student.email}>{student.name}</option>
                  ))}
                </datalist> */}
                
                <div className="space-y-2">
                  <Label htmlFor="visitorName">Visitor Name *</Label>
                  <Input
                    id="visitorName"
                    value={formData.visitor_name}
                    onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })}
                    placeholder="Name of visitor"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitorPhone">Visitor Phone *</Label>
                  <Input
                    id="visitorPhone"
                    type="tel"
                    value={formData.visitor_phone}
                    onChange={(e) => setFormData({ ...formData, visitor_phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check-In Time *</Label>
                  <Input
                    id="checkIn"
                    type="datetime-local"
                    value={formData.check_in}
                    onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                    required
                  />
                </div>
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
                    console.log(students,assign)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Check In Visitor</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
      <div className="text-sm text-gray-600">Total Visitors</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
      <div className="text-sm text-gray-600">Currently In</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-gray-600">{stats.checkedOut}</div>
      <div className="text-sm text-gray-600">Checked Out</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-purple-600">{stats.today}</div>
      <div className="text-sm text-gray-600">Today's Visitors</div>
    </CardContent>
  </Card>
</div>
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visitors</SelectItem>
                <SelectItem value="checked-in">Currently In</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-[180px]"
              placeholder="Filter by date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Visitors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Visitor Logs ({filteredVisitors.length})</CardTitle>
          <CardDescription>Track and manage visitor check-ins and check-outs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor Details</TableHead>
                  <TableHead>Visiting Student</TableHead>
                  <TableHead>Room No</TableHead>
                  <TableHead>Check-In/Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {visitor.visitor_name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {visitor.visitor_phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{visitor.student_name}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                        {assign && visitor
                          ? assign.find(a => a.students?.some(st => st.name === visitor.student_name))?.roomNo || "N/A"
                          : "Loading..."}
                        </div>
                      </div>
                    </TableCell>
                   
                    <TableCell>
                      <div className="space-y-1 text-sm md:-ml-5">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-green-600" />
                          In: {new Date(visitor.check_in).toLocaleString()}
                        </div>
                        {visitor.check_out && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-red-600" />
                            Out: {new Date(visitor.check_out).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {calculateDuration(visitor.check_in, visitor.check_out)}
                      </div>
                    </TableCell>
                    <TableCell>
                     {
                      visitor.check_out ? (
                        <div>
                         <CheckCircle className="h-4 w-4 text-gray-600" />
                        </div>
                     ) : (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                       <Badge className={getStatusColor(visitor.check_out)}>
                        In Hostel
                      </Badge>
                      </div>
                      )
                     }
                    </TableCell>
                    <TableCell>
                      {!visitor.check_out ?(
                        <Button
                          size="sm"
                          onClick={() => handleCheckOut(visitor.id)}
                          variant="outline"
                          className="flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Check Out
                        </Button>
                      ) :
                      (
                      ' Checked Out'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredVisitors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No visitor logs found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
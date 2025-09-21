import { useState} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/hooks/DataContext'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  User,
  Phone,
  Calendar,
} from 'lucide-react'


export function VisitorToManagement(): JSX.Element {

  const {visitors,loading} = useData()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')

  const thisVisitors = visitors.filter(v=>v.student_email === JSON.parse(localStorage.getItem('User'))?.student_details.email)

  const filteredVisitors = thisVisitors.filter(visitor => {
    const matchesSearch = visitor.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())    
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
      </div>


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
          <CardDescription>Track visitor check-ins and check-outs</CardDescription>
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
                        {JSON.parse(localStorage.getItem('User'))?.student_details.room_assignment.roomNo}
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
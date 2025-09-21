import { useState, useEffect } from 'react'
import { Card, CardContent,CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import Capture from './capture'
import { 
  UserCheck, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpCircle,
  Download,
  View
} from 'lucide-react'
import axios from 'axios'
import { toast } from '@/hooks/use-toast';

export function AttendanceSystem(): JSX.Element {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [error, setError] = useState<string>('')
  const [view,setView] = useState(false)

  
const attendanceDates = attendance.map(a => new Date(a.date));

  const firstDate = new Date(Math.min(...attendanceDates.map(d => d.getTime())));

  const allDates: string[] = [];
  for (let d = new Date(firstDate); d < new Date(); d.setDate(d.getDate() + 1)) {
    allDates.push(d.toISOString().split("T")[0]); 
  }

  const recordedDates = new Set(attendanceDates.map(d => d.toISOString().split("T")[0]));

  const absentDates = allDates.filter(d => !recordedDates.has(d));




  useEffect(() => {
    fetchAttendance()
  }, [selectedDate])

  const fetchAttendance = async (): Promise<void> => {
    try {
      const response = await axios.get(`${baseURL}/attendance/get-attendance?email=${JSON.parse(localStorage.getItem("User")).student_details.email}`)
      if (response.status === 200) {
        console.log("Attendace",response)
        setAttendance(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
      setError('Failed to load attendance data')
      toast({ title: "Failed To load attendance" });
    } finally {
      setLoading(false)
    }
  }
  
const exportAttendance = async (): Promise<void> => {
  try {
    const response = await axios.get(
      `${baseURL}/attendance/export-attendance?email=${
        JSON.parse(localStorage.getItem("User")).student_details.email
      }`,
      { responseType: "blob" } 
    );

    if (response.status === 200) {
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance.pdf`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error) {
    setError("Failed to export attendance PDF");
    console.error("Export error:", error);
  }
};
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800"
      case "absent": return "bg-red-100 text-red-800"
      case "late": return "bg-yellow-100 text-yellow-800"
      case "early": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }
  
  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case "present": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent": return <XCircle className="h-4 w-4 text-red-600" />
      case "late": return <Clock className="h-4 w-4 text-yellow-600" />
      case "early": return <ArrowUpCircle className="h-4 w-4 text-purple-600" />
      default: return <UserCheck className="h-4 w-4 text-gray-600" />
    }
  }

const filteredAttendance = attendance.filter(attend => {
  let matchesDate = true
  if(selectedDate){
     const attendanceDate = new Date(attend.date).toISOString().split('T')[0]
    matchesDate = attendanceDate === selectedDate
  }
  return matchesDate
})


const early = filteredAttendance.filter(a => a.status === "early").length;
const late = filteredAttendance.filter(a => a.status === "late").length;

const stats = {
  total: filteredAttendance.length + absentDates.length,
  early,
  late,
  present: filteredAttendance.filter(a => a.status === "present").length + early + late,
  absent: absentDates.length,
};

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
        <h2 className="text-2xl font-bold text-gray-900">Mark Daily Attendance</h2>
        <Button variant="outline" onClick={exportAttendance}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
      </div>

     <div className='bg-gray-100'>
     <Capture/>  
      </div>    

          {(error) && (
        <Alert variant={"destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}


<div className="flex flex-wrap justify-between gap-4 bg-gray-100 p-5">
  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold">{stats.total}</div>
      <div className="text-sm text-gray-600">Total</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-purple-800">{stats.early}</div>
      <div className="text-sm text-gray-600">Early</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-green-600">{stats.present}</div>
      <div className="text-sm text-gray-600">Present</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
      <div className="text-sm text-gray-600">Absent</div>
    </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
      <div className="text-sm text-gray-600">Late</div>
    </CardContent>
  </Card>
</div>


      <Card>
          <CardContent className="p-4">
            <Label htmlFor="date">Select Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-2"
            />
          </CardContent>
        </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
          <CardTitle>
            Attendance History
            ({attendance.length})
          </CardTitle>
          <Button
             size="sm"
             onClick={()=>setView(p=>!p)}
             variant="outline"
             className="flex items-center"
           >
             <View className="h-4 w-4" />
             View Faces
           </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Warning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((attend) => {                  return (
                    <TableRow key={attend.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{attend.name}</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{attend.location}</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{attend.date}</div>
                        </div>
                      </TableCell>
              
                      <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(attend.status)}
                            <Badge className={getStatusColor(attend.status)}>
                              {attend.status}
                            </Badge>
                          </div>
                      </TableCell>

                      <TableCell className={attend.warning >= 3 ? 'bg-red-500' : ''}>
                      <div className="space-y-1">
                          <div className="font-medium">{attend.warning}</div>
                        </div>
                      </TableCell>

                      <TableCell className={attend.warning >= 3 ? 'bg-red-500' : ''}>
                      
                        {view && (
                        <div className='mt-5'>
                          <img src={attend.image} alt={attend.name} />
                        </div>
                      )}
                      </TableCell>

                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            
            {filteredAttendance.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No attendance found
              </div>
            )}
            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
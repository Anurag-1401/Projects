import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/hooks/DataContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react'
import axios from 'axios'
import { toast } from '@/hooks/use-toast';



export function StudentManagement(): JSX.Element {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const {students,loading ,refetchAll} = useData();

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)

  const [editingStudent, setEditingStudent] = useState(null)

  const [formData, setFormData] = useState({
    admin_email: '',
    name: '',
    Guardian_Name: '',
    Guardian_Phone: '',
    reg_no: '',
    email: '',
    phone: '',
    department: '',
    year: "",
    DOB: '',
    Addmission_Date: '',
  })
  
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')


useEffect(() => {
  if (formData.reg_no.length > 8 && !editingStudent) {
    const exists = students.some(student => student.reg_no === formData.reg_no);
    if (exists) {
      setError("Student with this Registration Number already exists");
    } else {
      setError("");
    }
  } else {
    setError("");
  }
}, [formData.reg_no, students]);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const url = editingStudent ? `/edit-student/${editingStudent.id}` : '/add-student'
      const method = editingStudent ? 'put' : 'post'

      const response = await axios[method](`${baseURL}/student${url}`,{
        ...formData,
        admin_email:JSON.parse(localStorage.getItem("adminCreds")).Email
      })

      if (response.status === 200 || response.status === 201) {
        setSuccess(editingStudent ? "Student updated successfully" : "Student added successfully");
        refetchAll.students();
        setIsAddDialogOpen(false);
        console.log("Student:",response)
      }
      
    } catch (error) {
      <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
      </Alert>

      setError('Network error. Please try again.')
      console.error('Student operation error:', error)
      
    }
  }






  const handleEdit = (student): void => {
    setEditingStudent(student)
    setFormData({...student})
    setIsAddDialogOpen(true)
  }
  



  const handleDelete = async (student) => {
    if (!confirm(`Are you sure you want to delete this student (${student.name})?`)) return

    try {
      const response = await axios.delete(`${baseURL}/student/del-student/${student.id}`)

      if (response.status === 200) {
        setSuccess('Student deleted successfully')
        toast({
          title:`Student (${student.reg_no}) Deleted`
        })
        console.log(response)
        window.location.reload()
        refetchAll.students()
      } else {
        setError('Failed to delete student')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Delete error:', error)
    }
  }

  const resetForm = (): void => {
    setFormData({
      admin_email: '',
      reg_no: '',
      name: '',
      email: '',
      phone: '',
      DOB: '',
      Guardian_Name: '',
      Guardian_Phone: '',
      department: '',
      year: '',
      Addmission_Date:'',
    })
    setEditingStudent(null)
    setError('')
    setSuccess('')
  }

const filteredStudents = students.filter(student => {
    const matchesSearch = 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.reg_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    const matchesCourse = courseFilter === 'all' || student.department === courseFilter

    return matchesSearch && matchesStatus && matchesCourse
  })

  const getUniqueValues = (key): string[] => {
    return Array.from(new Set(students.map(s => s[key] as string).filter(Boolean)))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={()=>{
              resetForm();
              setIsAddDialogOpen(true)
            }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
      <DialogTitle>{editingStudent ? "Edit Student" : "Add Student"}</DialogTitle>
        <DialogDescription>
          {editingStudent ? 'Update student information' : 'Add a new student to the hostel'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Registration Number *</Label>
            <Input
              id="studentId"
              name="reg_no"
              value={formData.reg_no}
              onChange={(e) => setFormData({ ...formData, reg_no: e.target.value })}
              placeholder="e.g., STU001"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="student@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1234567890"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admissionDate">Admission Date *</Label>
            <Input
              id="admissionDate"
              name="Addmission_Date"
              type="date"
              value={formData.Addmission_Date}
              onChange={(e) => setFormData({ ...formData, Addmission_Date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianName">Guardian Name *</Label>
            <Input
              id="guardianName"
              name="Guardian_Name"
              value={formData.Guardian_Name}
              onChange={(e) => setFormData({ ...formData,Guardian_Name: e.target.value })}
              placeholder="Parent/Guardian name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Guardian Phone *</Label>
            <Input
              id="guardianPhone"
              name="Guardian_Phone"
              type="tel"
              value={formData.Guardian_Phone}
              onChange={(e) => setFormData({ ...formData, Guardian_Phone: e.target.value })}
              placeholder="+1234567890"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="course">Department *</Label>
            <Input
              id="course"
              name="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g., Computer Science"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Select
              value={formData.year.toString()}
              onValueChange={(value) => setFormData({ ...formData, year:value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

       
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(false)
            }}
          >
            Cancel
          </Button>

          <Button type="submit">
            {editingStudent ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </form>
    </DialogContent>
</Dialog>
</div>



{success && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}


{/* Filters */}
<Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {getUniqueValues('course').map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


 {/* Students Table */}
 <Card>
    <CardHeader>
       <CardTitle>Students ({filteredStudents.length})</CardTitle>
          <CardDescription>
            Manage student information and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Academi</TableHead>
                  <TableHead>Room No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">Reg No: {student.reg_no}</div>
                        <div className="text-xs text-gray-400">
                          Admitted: {new Date(student.Addmission_Date).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {student.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{student.department}</div>
                        <div className="text-sm text-gray-500">Year {student.year}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                      <div className="font-medium">  
                        {student.room_assignment?.roomNo ? student.room_assignment.roomNo : 'Not Allocated'}
                      </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No students found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
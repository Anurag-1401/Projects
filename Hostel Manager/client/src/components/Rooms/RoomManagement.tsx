import React, { useState,useEffect } from 'react';
import { useData } from '@/hooks/DataContext'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge';
import { Building, Users, Bed, Wrench ,HousePlus,AlertCircle,UserPlusIcon,Edit,Trash2} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert'
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

export const RoomManagement: React.FC = () => {


  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const {Rooms,RoomsAssigned,students,loading ,refetchAll} = useData();

  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [selStudent,setSelStudent]  = useState([])
  const [selStudentEdit,setSelStudentEdit]  = useState([])


  const [formData, setFormData] = useState({
    roomNo:'',
    capacity:'',
    status:''
  })

  const [allocData,setAllocData] = useState({
    roomNo:'',
    students:[]
  })


  const floorMap = {
    SHG: 0,
    SHF: 1,
    SHS: 2,  
    SHT: 3,
  };

  const floors = Array.from(new Set(
    Rooms.map(room => {
      const match = room.roomNo.match(/SHG|SHF|SHS|SHT/);
      return floorMap[match[0]] ?? null;
    })
)
).filter((floor):floor is number => floor !== null)
.sort((a,b)=> a-b);


const getFloorFromRoomNo = (roomNo) => {
  if (roomNo.includes("SHG")) return 0;
  if (roomNo.includes("SHF")) return 1; 
  if (roomNo.includes("SHS")) return 2;
  if (roomNo.includes("SHT")) return 3;
  return null;
};
  
const filteredRooms = selectedFloor === 'all' 
    ? Rooms 
    : Rooms.filter(room => getFloorFromRoomNo(room.roomNo) === selectedFloor);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'full':
        return 'bg-warning text-warning-foreground';
      case 'maintenance':
        return 'bg-destructive text-destructive-foreground';
      default:
        return '';
    }
  };

  const getOccupancyPercentage = (occupied: number, capacity: number) => {
    return (occupied / capacity) * 100;
  };

  const totalRooms = Rooms.length;
  const availableRooms = Rooms.filter(room => room.status === 'available').length;
  const fullRooms = Rooms.filter(room => room.status === 'full').length;
  const maintenanceRooms = Rooms.filter(room => room.status === 'maintenance').length;


  const handleRoomChange = (roomNo, capacity) => {
    setAllocData({ roomNo, students: Array(capacity).fill(null) });
    setSelStudent(Array(capacity).fill(null)); 
  };
  
  
  const handleStudentChange = (index, studentName) => {  
    const updated = [...selStudent];
    updated[index] = studentName;
    setSelStudent(updated);
    setAllocData({ ...allocData, students: updated });
  };
  


  const getAvailableStudents = (currentIndex) => {
    const selectedSet = new Set(
      selStudent.filter((s, i) => s !== null && i !== currentIndex)
    );
  
    const assignedSet = new Set();
    RoomsAssigned.forEach(room => {
      room.students.forEach(stu => assignedSet.add(stu.name));
    });
  
    return students
      .filter(student => !assignedSet.has(student.name)) 
      .filter(student => !selectedSet.has(student.name)); 
  };
  
  

  const handleStudentChangeEdit = (index, studentName) => {
    const studentObj = students.find((s) => s.name === studentName);
    if (!studentObj) return;
  
    const updated = [...selStudentEdit];
    updated[index] = studentObj;
    setSelStudentEdit(updated);
    setAllocData({ ...allocData, students: updated });
  };
  
  const getAvailableStudentsEdit = (currentIndex) => {
    // Students already selected in other selectors in this form
    const selectedSet = new Set(
      selStudentEdit
        .filter((s, i) => s !== null && i !== currentIndex)
        .map((s) => s.email)
    );
  
    // Students assigned in other rooms (excluding current room)
    const assignedSet = new Set();
    RoomsAssigned.forEach((room) => {
      if (editingRoom && room.roomNo === editingRoom.roomNo) return; // skip current room
      room.students.forEach((stu) => assignedSet.add(stu.email));
    });
  
    let available = students.filter(
      (student) => !selectedSet.has(student.email) && !assignedSet.has(student.email)
    );
  
    // Ensure currently selected student is included
    if (selStudentEdit[currentIndex]) {
      const current = selStudentEdit[currentIndex];
      if (!available.some((s) => s.email === current.email)) {
        available.push(current);
      }
    }
  
    // Optional: sort alphabetically
    available.sort((a, b) => a.name.localeCompare(b.name));
  
    return available;
  };
  
  


useEffect(() => {
  if (formData.roomNo.length > 5 && !editingRoom || allocData.roomNo.length>5 && !editingRoom) {
    const exists = Rooms.some(room => room.roomNo === formData.roomNo);
    if (exists) {
      setError("Room with this Number already exists");
    } else {
      setError("");
    }
  } else {
    setError("");
  }
}, [formData.roomNo, Rooms,allocData.roomNo]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    console.log(formData.roomNo,allocData.roomNo
  )
    try {

      const url = editingRoom ? `/edit-room/${editingRoom.id}` : '/add-room'
      const method = editingRoom ? 'put' : 'post'
      
      const response = await axios[method](`${baseURL}/room${url}`,{
        ...formData,
        students:allocData.students.filter(s=> s!== null && s!== undefined),
        occupied:allocData.students.filter(s=> s!== null && s!== undefined).length,
        admin_email:JSON.parse(localStorage.getItem("adminCreds")).Email
      })

      if(response.status === 201 || response.status === 200){
        setSuccess(editingRoom ? "Room updated successfully" : "Room added successfully");
        toast({
          title:`Room ${editingRoom ? 'Updated' : 'Added'}`
        })
        refetchAll.rooms()
        setIsAddDialogOpen(false);
        console.log("Room:",response);
        setEditingRoom(1);
      }
    } catch (error) {
      <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
       </Alert>
       
       setError('Network error. Please try again.')
       console.error('Student operation error:', error)

    }
  };


  const handleAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const response = await axios.post(`${baseURL}/room/assignment`,{
        ...allocData,
        admin_email:JSON.parse(localStorage.getItem("adminCreds")).Email

      })

      if(response.status === 201){
        setSuccess("Room allocated successfully");
        toast({
          title:`Room Allocated`
        })
        refetchAll.assignedRooms();
        setIsAssignDialogOpen(false);
        console.log("Room Assigned:",response)
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

const handleEdit = (room,roomStudents): void => {
    setEditingRoom(room)
    setFormData({...room})
    setIsAddDialogOpen(true)

    const selStudents = Array.from({ length: room.capacity }, (_, i) => roomStudents[i] || null);
    setSelStudentEdit(selStudents);

    setAllocData({ ...allocData, students: selStudents });
    }




  const resetForm = (): void => {
    setFormData({
      roomNo:'',
      capacity:'',
      status:''
    });

    setAllocData({
      roomNo:'',
      students:[]
    });

    setEditingRoom(null)
    setError('')
    setSuccess('')
  }

const delRoom = async (room) => {
  if (!confirm(`Are you sure you want to delete this Room (${room.roomNo})?`)) return

  try {
    const response = await axios.delete(`${baseURL}/room/del-room/${room.id}`)
    if(response.status === 200) {
      setSuccess("Room deleted successfully");
      toast({
        title:`Room Deleted`
      })
      refetchAll.rooms();
      console.log("Room:",response)
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
        <h2 className="text-2xl font-bold text-foreground">Room Management</h2>
       
       <div className='space-x-5'>
       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={()=>{
              resetForm();
              setIsAddDialogOpen(true)
            }}>
              <HousePlus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
      <DialogTitle>{editingRoom ? "Edit Room" : "Add Room"}</DialogTitle>
        <DialogDescription>
          {editingRoom ? 'Update the Room' : 'Add a new Room'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
  {/* Room No + Capacity */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label htmlFor="roomNo">Room Number *</Label>
      <Input
        id="roomNo"
        value={formData.roomNo}
        onChange={(e) =>
          setFormData({ ...formData, roomNo: e.target.value })
        }
        placeholder="e.g., SHFA01"
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="capacity">Capacity *</Label>
      <Select
        value={formData.capacity.toString()}
        onValueChange={(value) =>
          setFormData({ ...formData, capacity: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>




  {editingRoom && (
    <div className="space-y-6">
      {/* Status */}
      <div className="w-full md:w-1/2 space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={formData.status || undefined}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="full">Full</SelectItem>
          </SelectContent>
        </Select>
      </div>




      {/* Student Selectors */}
      <div className="space-y-4">
        <Label>Allocate Students</Label>
        <div className="flex flex-wrap gap-4">
          {selStudentEdit.map((student, i) => (
            <div key={i} className="w-64 space-y-2">
              <Label>Student {i + 1}</Label>
              <Select
                value={student?.name || ""}
                onValueChange={(value) =>
                  handleStudentChangeEdit(i, value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableStudentsEdit(i).map((s) => (
                    <SelectItem key={s.email} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

  {/* Error */}
  {error && (
    <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )}

  {/* Actions */}
  <div className="flex justify-end space-x-2 pt-4">
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        resetForm();
        setSelStudent([])
        setIsAddDialogOpen(false);
      }}
    >
      Cancel
    </Button>

    <Button type="submit">
      {editingRoom ? "Update Room" : "Add Room"}
    </Button>
  </div>
</form>

      </DialogContent>
      </Dialog>






<Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
    <DialogTrigger asChild>
            <Button onClick={()=>{
              resetForm();
              setIsAssignDialogOpen(true)
            }}>
              <UserPlusIcon className="h-4 w-4" />
              Room Assignment
            </Button>
          </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
      <DialogTitle>Allocation</DialogTitle>
        <DialogDescription>
          Allocate Rooms to Students
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleAssign} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Room Number *</Label>

            <Select value={allocData.roomNo}
            onValueChange={(value) => {
              const room = Rooms.find(r => r.roomNo === value);
              handleRoomChange(value, room.capacity);
            }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Room No'/>
              </SelectTrigger>

              <SelectContent>
                {Rooms.map((room)=>(
                  <SelectItem key={room.id} value={room.roomNo}>{room.roomNo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          
          <div className="space-y-2">
            {Array.from({length:selStudent.length},(_,i) => (
            <Select 
            key={i}
            value={selStudent[i] || ""}
            onValueChange={(value)=> handleStudentChange(i,value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Students'/>
              </SelectTrigger>

              <SelectContent>
                {getAvailableStudents(i).map((student)=>(
                  <SelectItem key={student.id} value={student.name}>{student.name}</SelectItem>
                ))}
              </SelectContent>
              </Select>
            ))}
          </div>
        </div>

       

       
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              setSelStudent([])
              setIsAssignDialogOpen(false)
            }}
          >
            Cancel
          </Button>

          <Button type="submit">
            Allocate
          </Button>
        </div>
      </form>
      </DialogContent>
      </Dialog>
       </div>


  </div>

      

  {success && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
  )}

{/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold text-foreground">{totalRooms}</p>
              </div>
              <Building className="text-primary" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-success">{availableRooms}</p>
              </div>
              <Bed className="text-success" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Full</p>
                <p className="text-2xl font-bold text-warning">{fullRooms}</p>
              </div>
              <Users className="text-warning" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-destructive">{maintenanceRooms}</p>
              </div>
              <Wrench className="text-destructive" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

  

{/* Floor Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Floor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedFloor === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFloor('all')}
              size="sm"
            >
              All Floors
            </Button>
            {floors.map((floor) => (
              <Button
                key={floor}
                variant={selectedFloor === floor ? 'default' : 'outline'}
                onClick={() => setSelectedFloor(floor)}
                size="sm"
              >
                Floor {floor}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

{/* Rooms Grid */}
<div className="px-2 sm:px-4 lg:px-6 xl:-ml-8">
<div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
    {filteredRooms.map((room) => {
      const assignment = RoomsAssigned.find(r => r.roomNo === room.roomNo);
      const roomStudents = assignment ? assignment.students : [];
      const occupancyPercentage = getOccupancyPercentage(room.occupied, room.capacity);

      return (
        <Card 
          key={room.id} 
          className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 rounded-2xl w-full min-w-[300px] h-full overflow-hidden"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">{room.roomNo}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(room, roomStudents)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => delRoom(room)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
            <Badge variant="outline" className={` ${getStatusColor(room.status)}`}>
                {room.status}
            </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base">Floor: {getFloorFromRoomNo(room.roomNo)}</h2>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Occupancy:</span>
                <span className="font-medium">{room.occupied}/{room.capacity}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    occupancyPercentage >= 100 ? "bg-destructive" :
                    occupancyPercentage >= 80 ? "bg-warning" : "bg-primary"
                  )}
                  style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                />
              </div>
            </div>

            {roomStudents.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Residents:</p>
                <div className="space-y-1">
                  {roomStudents.map((student) => (
                    <div key={student.email} className="text-sm truncate">
                      {student.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No residents</p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    })}
  </div>
</div>



      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No rooms found for the selected floor</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
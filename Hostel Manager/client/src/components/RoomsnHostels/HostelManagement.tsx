import React, { useState,useEffect, useMemo } from 'react';
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

export const HostelManagement: React.FC = () => {


  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const {hostels,refetchAll,loading} = useData();

  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHostel, setEditingHostel] = useState(null)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [selStudent,setSelStudent]  = useState([])
  const [selStudentEdit,setSelStudentEdit]  = useState([])

  const [formData, setFormData] = useState({
  name: '',
  location: '',
  total_wings_per_hostel: '',
  total_floors_per_wing: '',
  total_rooms_per_floor_per_wing: ''
})


 const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const url = editingHostel
      ? `/hostel/edit/${editingHostel.id}`
      : `/hostel/add`

    const method = editingHostel ? "put" : "post"

    const res = await axios[method](`${baseURL}${url}`, formData)

    if (res.status === 200 || res.status === 201) {
      toast({ title: editingHostel ? "Hostel Updated" : "Hostel Added" })
      refetchAll.hostels()
      setIsDialogOpen(false)
    }
  } catch (err) {
    setError("Error saving hostel")
  }
}

const deleteHostel = async (hostel) => {
  if (!confirm(`Delete ${hostel.name}?`)) return

  await axios.delete(`${baseURL}/hostel/delete/${hostel.id}`)

  toast({ title: "Hostel Deleted" })
  refetchAll.hostels()
}

const resetForm = (): void => {
    setFormData({
        name: '',
        location: '',
        total_wings_per_hostel: '',
        total_floors_per_wing: '',
        total_rooms_per_floor_per_wing: ''
    });

    setEditingHostel(null)
    setError('')
    setSuccess('')
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
        <h2 className="text-2xl font-bold text-foreground">Hostel Management</h2>
       
       <div className='space-x-5'>
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={()=>{
              resetForm();
              setIsDialogOpen(true)
            }}>
              <HousePlus className="h-4 w-4 mr-2" />
              Add Hostel
            </Button>
          </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
      <DialogTitle>{editingHostel ? "Edit Hostel" : "Add Hostel"}</DialogTitle>
        <DialogDescription>
          {editingHostel ? 'Update the Hostel' : 'Add a new Hostel'}
        </DialogDescription>
      </DialogHeader>
 <form onSubmit={handleSubmit} className="space-y-4">

      <Input
        placeholder="Hostel Name"
        value={formData.name}
        onChange={(e)=>setFormData({...formData,name:e.target.value})}
      />

      <Input
        placeholder="Location"
        value={formData.location}
        onChange={(e)=>setFormData({...formData,location:e.target.value})}
      />

      <Input
        placeholder="Wings"
        value={formData.total_wings_per_hostel}
        onChange={(e)=>setFormData({...formData,total_wings_per_hostel:e.target.value})}
      />

      <Input
        placeholder="Floors per Wing"
        value={formData.total_floors_per_wing}
        onChange={(e)=>setFormData({...formData,total_floors_per_wing:e.target.value})}
      />

      <Input
        placeholder="Rooms per Floor"
        value={formData.total_rooms_per_floor_per_wing}
        onChange={(e)=>setFormData({...formData,total_rooms_per_floor_per_wing:e.target.value})}
      />

      <Button type="submit">
        {editingHostel ? "Update" : "Create"}
      </Button>

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

{/* 
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
      </div> */}

  

{/* Hostels Grid */}
<div className="px-2 sm:px-4 lg:px-6 xl:-ml-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {hostels.map((hostel) => {

    const totalRooms =
      hostel.total_wings_per_hostel *
      hostel.total_floors_per_wing *
      hostel.total_rooms_per_floor_per_wing

    return (
      <Card key={hostel.id}>
        <CardHeader>
          <CardTitle>{hostel.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">

          <p>📍 {hostel.location}</p>
          <p>🏢 Wings: {hostel.total_wings_per_hostel}</p>
          <p>🏗 Floors: {hostel.total_floors_per_wing}</p>
          <p>🚪 Rooms/Floor: {hostel.total_rooms_per_floor_per_wing}</p>

          <p className="font-bold text-lg">
            Total Rooms: {totalRooms}
          </p>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => {
                setEditingHostel(hostel)
                setFormData(hostel)
                setIsDialogOpen(true)
              }}
            >
              Edit
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteHostel(hostel)}
            >
              Delete
            </Button>
          </div>

        </CardContent>
      </Card>
    )
  })}
</div>
</div>
    </div>
  )
}
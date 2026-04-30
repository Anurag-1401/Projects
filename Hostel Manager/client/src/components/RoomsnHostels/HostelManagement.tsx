import React, { useMemo, useState} from 'react';
import { useData } from '@/hooks/DataContext'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { HousePlus,AlertCircle,UserPlusIcon,Edit,Trash2} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert'
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

export const HostelManagement: React.FC = () => {


  const baseURL = import.meta.env.VITE_BACKEND_URL;
  const admin = JSON.parse(localStorage.getItem('adminCreds') || '{}');
  const {hostels,setHostels,refetchAll,loading} = useData();

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHostel, setEditingHostel] = useState(null)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const [formData, setFormData] = useState({
  name: '',
  location: '',
  total_wings_per_hostel: 0,
  total_floors_per_wing: 0,
  total_rooms_per_floor_per_wing: 0
})


 const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const url = editingHostel
      ? `/hostel/edit/${editingHostel.id}`
      : `/hostel/add`

    const method = editingHostel ? "put" : "post"

    const res = await axios[method](`${baseURL}${url}`, {
      ...formData,
      createdBy:admin?.Email
    })

    if (res.status === 200 || res.status === 201) {
      toast({ title: editingHostel ? "Hostel Updated" : "Hostel Added" })
      setIsDialogOpen(false)
      await refetchAll.hostels()
      resetForm()
    }
  } catch (err) {
    setError("Error saving hostel")
  }
}

const deleteHostel = async (hostel) => {
  if (!confirm(`Delete ${hostel.name}?`)) return

  await axios.delete(`${baseURL}/hostel/delete/${hostel.id}`)
    
  toast({ title: "Hostel Deleted" })

  setHostels(prev => prev.filter(h => h.id !== hostel.id))
}

const handleEdit = (hostel) => {
  setEditingHostel(hostel)

    setFormData({
      name: hostel.name,
      location: hostel.location,
      total_wings_per_hostel: hostel.total_wings_per_hostel,
      total_floors_per_wing: hostel.total_floors_per_wing,
      total_rooms_per_floor_per_wing: hostel.total_rooms_per_floor_per_wing
    })

    setIsDialogOpen(true)
}

const resetForm = (): void => {
    setFormData({
        name: '',
        location: '',
        total_wings_per_hostel: 0,
        total_floors_per_wing: 0,
        total_rooms_per_floor_per_wing: 0
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
        type='number'
        placeholder="Wings"
        value={formData.total_wings_per_hostel}
        onChange={(e)=>setFormData({...formData,total_wings_per_hostel:Number(e.target.value)})}
      />

      <Input
        type='number'
        placeholder="Floors per Wing"
        value={formData.total_floors_per_wing}
        onChange={(e)=>setFormData({...formData,total_floors_per_wing:Number(e.target.value)})}
      />

      <Input
        type='number'
        placeholder="Rooms per Floor per Wing"
        value={formData.total_rooms_per_floor_per_wing}
        onChange={(e)=>setFormData({...formData,total_rooms_per_floor_per_wing:Number(e.target.value)})}
      />

  <div className="flex justify-end space-x-2 pt-4">
      <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              setIsDialogOpen(false);
            }}
          >
            Cancel
          </Button>

      <Button type="submit">
        {editingHostel ? "Update" : "Create"}
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
       <Card 
                key={hostel.id} 
                className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 rounded-2xl w-full min-w-[300px] h-full overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{hostel.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(hostel)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => deleteHostel(hostel)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                   <div>
                      {hostel.location}
                  </div>
                </CardHeader>
      
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-sm sm:text-base">Floor: {hostel.total_floors_per_wing}</h2>
                    <div className="flex justify-between items-center">
                      <h2 className="text-sm sm:text-base">Wings: {hostel.total_wings_per_hostel}</h2>
                      <h2 className="text-sm sm:text-base">Rooms: {totalRooms}</h2>
                    </div>
                  </div>
                </CardContent>
              </Card>
    )
  })}
</div>
</div>

{hostels.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No hostels found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
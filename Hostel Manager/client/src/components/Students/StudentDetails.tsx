import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, User, Mail, Phone, MapPin, Calendar, GraduationCap ,KeySquareIcon,BedIcon,AlertCircle, Save} from 'lucide-react';
import axios from 'axios'
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription} from '@/components/ui/alert'


export const StudentDetails: React.FC = () => {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const [isEdit,setisEdit] = useState(false);
  const [error, setError] = useState<string>('')
  const[password,setPassword] = useState('')


  const [formData, setFormData] = useState({
    id:'',
    name: '',
    Guardian_Name: '',
    Guardian_Phone: 0,
    reg_no: '',
    email: '',
    phone: 0,
    department: '',
    year: "",
    DOB: '',
    Addmission_Date: '',
    room_assignment:{roomNo:'',assignedBy:''},
  })

 useEffect(() => {
  fetchStudent()
},[])

const fetchStudent = async (): Promise<void> => {
  try {
    const response = await axios.get(`${baseURL}/student/get-students?email=${JSON.parse(localStorage.getItem('User'))?.student_details.email}`)
    const res = await axios.get(`${baseURL}/studentLogin/get/${JSON.parse(localStorage.getItem('User'))?.student_details.id}`)
    if (response.status==200 || res.status == 200) {
      setFormData(response.data)
      setPassword(res.data.password)
      console.log("Student",response,res)
    }
  } catch (error) {
    console.error('Failed to fetch student:', error)
    setError('Failed to load student')
    toast({
      title:"Student Not Found"
    })
}
}

const handleProfileUpdate = async () => {

  const data =  {
    phone:formData.phone,
    DOB:formData.DOB,
    Guardian_Name:formData.Guardian_Name,
    Guardian_Phone:formData.Guardian_Phone,
  }

  try {
    const response = await axios.put(`${baseURL}/student/edit/${formData.id}` ,data)
    const res = await axios.put(`${baseURL}/studentLogin/edit/${formData.id}` , {password:password})
      if (response.status == 200 || res.status == 200) {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved successfully.",
        });

        fetchStudent()

        console.log("Student",response.data,res.data)

        setTimeout(() => {
          window.location.reload()
        }, 500);
      }
  } catch (error) {

    toast({
      title: "Profile not Updated",
      description: "Your profile information has not been saved, try again!",
    });
    setError('Failed to update student')
    console.error('Error during update:', error);
}
}

return (
    <div className="space-y-6 w-full">

      {error && !formData.name && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Student Details</h2>

        <Button
         variant="outline"
         size="sm"
         onClick={() => { 
           setisEdit(prev => !prev);
          //  fetchStudent();
           {false && setTimeout(() => {
             window.location.reload()
           }, 500);}
         }
         }
         className={`border ${
           isEdit
             ? 'text-red-400 border-red-400 hover:bg-red-400'
             : 'text-blue-400 border-blue-400'
         }`}
       >
         <Pencil className="w-4 h-4 mr-0.5" />
         {isEdit ? "Cancel" : "Edit"}
       </Button>
      </div>

      <div className="w-full space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-2 ml-1">
          
              <div className="flex items-start gap-3">
                <User className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.name || ''}
                    disabled={true}
                  />
                </div>
              </div>
          
              <div className="flex items-start gap-3">
                <Mail className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <Input
                    type="email"
                    className="w-full"
                    value={formData.email ||''}
                    disabled={true}
                  />
                </div>
              </div>
          
              <div className="flex items-start gap-3">
                <Phone className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.phone ||''}
                    onChange={(e)=>setFormData({...formData,phone:Number(e.target.value)})}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Year</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.year||''}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Course</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.department||''}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Registration Number</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.reg_no||''}
                    disabled={true}
                  />
                </div>
              </div>
          
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">DOB (mm/dd/yyyy)</p>
                  <Input
                   type="date"
                   value={formData.DOB ? new Date(formData.DOB).toISOString().split("T")[0] : ""} 
                   onChange={(e) => setFormData({ ...formData, DOB: e.target.value })} 
                   disabled={!isEdit}
                 />

                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Guardian Name</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.Guardian_Name ||''}
                    onChange={(e)=>setFormData({...formData,Guardian_Name:e.target.value})}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Guardian Phone</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.Guardian_Phone||''}
                    onChange={(e)=>setFormData({...formData,Guardian_Phone:Number(e.target.value)})}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <KeySquareIcon className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Password</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={password||''}
                    onChange={(e)=>setPassword(e.target.value)}
                    disabled={!isEdit}
                  />
                </div>
              </div>       
            </div>
      </CardContent>

          {isEdit && <Button  className='border border-blue-400 m-5'
            variant='outline'
            onClick={ () => {
              handleProfileUpdate() ;
              setisEdit(false);
            }
            }
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>}
          
          </Card>

          {/* Room Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Room Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">

                <BedIcon className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Room No</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.room_assignment.roomNo||''}
                    disabled={true}
                  />
                </div>
              </div>

                <div className="flex items-start gap-3">
                <User className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Assigned By</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.room_assignment.assignedBy||''}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-6" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Admitted Date (yyyy/mm/dd)</p>
                  <Input
                    type="text"
                    className="w-full"
                    value={formData.Addmission_Date||''}
                    disabled={true}
                  />
                </div>
              </div>

              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};
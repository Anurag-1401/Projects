import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/hooks/DataContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Search, 
  Calendar,
  AlertTriangle,
  CreditCard,
  IndianRupee,
  ReceiptIndianRupee,
  Verified,
  Download
} from 'lucide-react'
import axios from 'axios'
import { toast } from "@/components/ui/use-toast";

export function FeeManagement(): JSX.Element {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const student = JSON.parse(localStorage.getItem('User'))

  const {payments,students,refetchAll,loading} = useData()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [monthFilter, setMonthFilter] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    amount: 0,
    paymentId:'',
    paymentType: 'campus hostel',
    date:'',
    remarks: ''
  })
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  



useEffect(() => {
  if (formData.paymentId.length > 8) {
    const exists = payments.some(p => p.paymentId === formData.paymentId);
    if (exists) {
      setError("Payment with this ID is already exists");
    } else {
      setError("");
    }
  } else {
    setError("");
  }
}, [formData.paymentId, payments]);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(`${baseURL}/payment/add-payment`, {...formData,studentId:student.student_details.id})

      if (response.status === 201) {
        console.log("Payment Added",response)
        setSuccess('Payment Added successfully')
        refetchAll.payments()
        resetForm()
        setIsAddDialogOpen(false)
        toast({
          title:"Payment Added"
        })
        refetchAll.fetchPayments()
        refetchAll.students()
      } else {
        setError('Failed add payment')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Payment Adding error:', error)
    }
  }

  const updatePayment = async (id) => {
    try {
      const response = await axios.put(`${baseURL}/payment/edit-payment/${id}`,{adminId:JSON.parse(localStorage.getItem('adminCreds')).Email})

      if (response.status == 200) {
        setSuccess('Payment verified successfully')
        toast({
          title:"Payment verified"
        })
        refetchAll.payments()
      } 
    } catch (error) {
      setError('Payment verification error. Please try again.')
      console.error('Payment verification error:', error)
    }
  }

  const setDueDate = async () =>{
    try {
      const response = await axios.put(`${baseURL}/payment/set-dueDate`,{feesDue:dateFilter})

      if (response.status == 200) {
        setSuccess('Due date set')
        toast({
          title:"Due date set"
        })
        refetchAll.payments()
        refetchAll.students()
      } 
    } catch (error) {
      setError('Due date setting error. Please try again.')
      console.error('Due date setting error:', error)
    }
  }

  const resetForm = (): void => {
    setFormData({
      amount: 0,
      paymentType: 'campus hostel',
      paymentId: '',
      remarks: '',
      date:'',
    })
    setError('')
    setSuccess('')
  }

  const exportPayments = async (): Promise<void> => {
    try {
      const response = await axios.get(
        `${baseURL}/payment/export-payment${student ? `?id=${student?.student_details.id}`:''}`,
        { responseType: "blob" } 
      );
  
      if (response.status === 200) {
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);
  
        const a = document.createElement("a");
        a.href = url;
        a.download = `Fees.pdf`;
        document.body.appendChild(a);
        a.click();
  
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      setError("Failed to export payment PDF");
      console.error("Export error:", error);
    }
  };


  const thisPayments = payments.filter(p=>p.studentId === student?.student_details.id)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.remarks === statusFilter
    const matchesType = typeFilter === 'all' || payment.paymentType === typeFilter
    const matchesMonth = !monthFilter || 
    new Date(payment.date).toISOString().slice(0, 7) === monthFilter;
      return matchesSearch && matchesStatus && matchesType && matchesMonth
  })

  let bmess = filteredPayments.filter(p=> p.paymentType === 'boys mess').length
  let gmess = filteredPayments.filter(p=> p.paymentType === 'girls mess').length
  let camp = filteredPayments.filter(p=> p.paymentType === 'campus hostel').length
  const total = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const stats = {
    total: filteredPayments.length,
    campusHostel:camp,
    bMess:bmess,
    gMess:gmess,
    // paid: filteredPayments.filter(p => p.status === 'paid').length,
    pending: students.filter(st => !payments.some(p=>p.studentId === st.id)).length,
    overdue: students.filter(st=> st.feesDue && new Date(st.feesDue) < new Date()).length,
    totalCollected:total,
    totalPending: students.length * 46000 - payments.reduce((sum, p) => sum + (p.amount || 0), 0)
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
    Fee Management
  </h2>

  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
  <div className="w-full sm:flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:flex">

    <Button variant="outline" onClick={exportPayments} className="w-full sm:w-auto">
      <Download className="h-4 w-4 mr-2" />
      Export
    </Button>

     {!student && (
       <>
         <div className="relative w-full justify-center">
           <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
           <Input
             type="date"
             value={dateFilter}
             onChange={(e) => setDateFilter(e.target.value)}
             className="pl-9 h-10 w-full rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 font-medium text-sm sm:text-base cursor-pointer"
           />
         </div>
         <Button
           onClick={setDueDate}
           className="h-10 px-4 sm:px-6 w-full sm:w-auto"
         >
           Set Due Date
         </Button>
       </>
     )}

</div>


    {student && <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetForm} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Fee Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
      <DialogHeader>
                <DialogTitle>Add Fee Record</DialogTitle>
                <DialogDescription>
                  Create a new fee record for a student
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="startDate">Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
               </div>
               </div>

               

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentType">Payment Type *</Label>
                    <Select
                      value={formData.paymentType}
                      onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campus hostel">Campus Hostel</SelectItem>
                        <SelectItem value="boys mess">Boys Mess</SelectItem>
                        <SelectItem value="girls mess">Girls Mess</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentModeForm">Payment ID *</Label>
                    <Input
                      id="paymentId"
                      type="text"
                      value={formData.paymentId}
                      onChange={(e) => setFormData({ ...formData, paymentId:e.target.value})}
                      placeholder="DUO..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
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
                  <Button type="submit">Create Fee Record</Button>
                </div>
              </form>
      </DialogContent>
    </Dialog>}
  </div>
</div>


{(success || error) && (
  <Alert variant={error ? "destructive" : "default"}>
    <AlertTriangle className="h-4 w-4" />
    <AlertDescription>{success || error}</AlertDescription>
  </Alert>
)}

{student &&
  students
  .filter(st => st.email === student.student_details.email && payments.filter(p=>p.studentId === st.id).length<2)
  .map(st => (
    <Alert>
    <p key={st.id} className="text-sm text-gray-700">
      Due date to pay the remaining fees is {" "}
      <span
        className={`font-medium ${
          new Date(st.feesDue) < new Date()
            ? "text-red-600"
            : "text-blue-600"
        }`}
      >
        {st.feesDue ? st.feesDue : "Not Assigned"}
      </span>
    </p>
  </Alert>
  ))}



  {!student && <div className="flex flex-wrap justify-between gap-4 bg-gray-100 p-5">
  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
     <div className="text-sm text-gray-600">Total Records</div>
   </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
    <div className="text-2xl font-bold text-purple-600">{stats.campusHostel}</div>
     <div className="text-sm text-gray-600">Campus Hostel</div>
   </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
    <div className="text-2xl font-bold text-gray-600">{stats.bMess}</div>
     <div className="text-sm text-gray-600">Boys Mess</div>
   </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
    <div className="text-2xl font-bold">{stats.gMess}</div>
     <div className="text-sm text-gray-600">Girls Mess</div>
   </CardContent>
  </Card>

  {/* <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
    <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
   <div className="text-sm text-gray-600">Paid</div>
</CardContent>
  </Card> */}

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
    <div className="text-sm text-gray-600">Pending</div>
  </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
    <CardContent className="p-4 text-center">
    <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
    <div className="text-sm text-gray-600">Overdue</div>
 </CardContent>
  </Card>

  <Card className="flex-1 min-w-[120px]">
  <CardContent className="p-4 text-center flex flex-col items-center justify-center">
    <div className="flex items-center gap-1 text-2xl font-bold text-green-600 sm:mt-0 lg:mt-3 mt-3">
      <IndianRupee className='h-5 w-5'/>
      <span className='text-lg'>{stats?.totalCollected?.toFixed(2) || "0.00"}</span>
    </div>
    <div className="text-sm text-gray-600 mt-1">Collected</div>
  </CardContent>
</Card>



<Card className="flex-1 min-w-[120px]">
  <CardContent className="p-4 text-center flex flex-col items-center justify-center">
    <div className="flex items-center gap-1 text-2xl font-bold text-orange-600">
      <IndianRupee className='h-5 w-5'/>
      <span className='text-lg'>{stats?.totalPending?.toFixed(2) || "0.00"}</span>
    </div>
    <div className="text-sm text-gray-600 mt-1">Pending Amount</div>
  </CardContent>
</Card>
  
</div>}



      {/* Filters */}
      <Card className="w-full">
  <CardContent className="p-4">
    <div className="flex flex-col md:flex-row gap-4 w-full">
      
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 rounded-lg"
          aria-label="Search payments"
        />
      </div>

      {!student && <div className="flex-1 min-w-[150px]">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 rounded-lg">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>}

      <div className="flex-1 min-w-[150px]">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-10 rounded-lg">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="campus hostel">Campus Hostel</SelectItem>
            <SelectItem value="boys mess">Boys Mess</SelectItem>
            <SelectItem value="girls mess">Girls Mess</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <Input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="h-10 rounded-lg"
          aria-label="Filter by month"
        />
      </div>
    </div>
  </CardContent>
</Card>



      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Payments ({filteredPayments.length})</CardTitle>
          <CardDescription>Manage student fee payments and records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Room No</TableHead>
                  <TableHead>Payment Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Recorded On</TableHead>
                  <TableHead>Verified By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(student ? thisPayments : filteredPayments).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                        <div className="font-medium flex items-center">
                          {payment.studentName}
                      </div>
                    </TableCell>

                    <TableCell>
                        <div className="font-medium flex items-center">
                          {payment.roomNo}
                      </div>
                    </TableCell>

                    <TableCell>
                       <div className="space-y-2">
                         <div className="font-medium capitalize">{payment.paymentType}</div>
                         <div className="flex items-center gap-1 text-gray-600">
                           <ReceiptIndianRupee className="w-4 h-4" />
                          <span>{payment.paymentId}</span>
                         </div>
                         <div><span>Date: {payment.date}</span></div>
                       </div>
                     </TableCell>

                    <TableCell>
                     <div className="flex items-center gap-1 font-bold text-lg">
                          <IndianRupee className="w-4 h-4" />
                          <span>{payment.amount.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    

                    <TableCell>
                     <div className="ml-2 flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          <span>{payment.remarks}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                     <div className="ml-2 flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          <span>{new Date(payment.createdAt).toISOString().slice(0,10)}</span>
                      </div>
                    </TableCell>


                    <TableCell>
                     {student ? (
                        <div className="text-sm text-gray-500">
                        {payment.adminId ? (
                          <>
                           <div className="flex flex-col mt-2 space-y-1">
                             <span >By: {payment.adminId}</span>
                             <span>
                             On: {new Date(payment.updatedAt).toLocaleDateString()}
                           </span>
                           </div>
                       </>

                        ):(
                          <span>Not yet Verified</span>
                        )}
                      </div>
                     ): (
                      <div className="flex space-x-2">
                      {!payment.adminId ? (
                      <>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={()=>updatePayment(payment.id)}
                      >
                        <Verified className="h-4 w-4" />
                        Verify
                      </Button>
                        </>
                      ):(
                        <div className="flex flex-col mt-2 space-y-1">
                        <span >By: {payment.adminId}</span>
                        <span>
                        On: {new Date(payment.updatedAt).toLocaleDateString()}
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
            
            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No fee payments found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
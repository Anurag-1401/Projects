import { useState} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  UserCheck, 
  MessageSquare, 
  Calendar, 
  Home, 
  BadgeIndianRupee,
  Eye,
  Building,
} from 'lucide-react'
import { StudentManagement } from '@/components/Students/StudentManagent'
import { AttendanceSystem } from '@/components/Attendance/AttendanceTracker'
import { ComplaintSystem } from '@/components/Complaints/complaintManagent'
import { LeaveApplications } from '@/components/LeaveApp/leaveApplication'
import { RoomManagement } from '@/components/Rooms/RoomManagement'
import { VisitorManagement } from '@/components/Visitors/visitors'
import { FeeManagement } from '@/components/Fees/feesManagement'
import { DashboardStats } from '@/components/Dashboard/DashboardCards'
import Navbar from './navbar'
import ChatBot from '@/hooks/assistant'


export default function HostelManagementSystem(): JSX.Element {

    const [activeTab, setActiveTab] = useState(() => {
      return sessionStorage.getItem("activeTab") || 'dashboard';
    }); 


  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'leave', label: 'Leave Applications', icon: Calendar },
    { id: 'rooms', label: 'Room Management', icon: Building },
    { id: 'visitors', label: 'Visitor Logs', icon: Eye },
    { id: 'fees', label: 'Fees Management', icon: BadgeIndianRupee },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

    <>
    <Navbar/>
    </>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={() => {}}  className="space-y-12">
          <div className="border-b border-gray-200">
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full h-auto gap-y-1 bg-gray-100 p-1 rounded-lg ">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      sessionStorage.setItem('activeTab', item.id);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          <ChatBot/>

         <TabsContent value="dashboard" className="space-y-6"> 
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Dashboard</h2>
              <DashboardStats />
            </div>
          </TabsContent>

          <TabsContent value="students">
            <StudentManagement />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceSystem />
          </TabsContent>

          <TabsContent value="complaints">
            <ComplaintSystem />
          </TabsContent>

          <TabsContent value="leave">
            <LeaveApplications />
          </TabsContent>

          <TabsContent value="rooms">
           <RoomManagement />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorManagement />
          </TabsContent>


          <TabsContent value="fees">
            <FeeManagement />
          </TabsContent> 

        </Tabs>
      </div>
    </div>
  )
}
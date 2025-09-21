import { Card, CardContent,CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/hooks/DataContext'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserCheck, 
  MessageSquare, 
  Calendar, 
  Home, 
  AlertTriangle,
  Bell,
  DollarSign,
} from 'lucide-react'


export function DashboardStats(): JSX.Element {

  const student = JSON.parse(localStorage.getItem('User'))

  const { students, Rooms,RoomsAssigned, complaints, attendance,applications,loading, refetchAll } = useData();

  const pendingComplaints = complaints.filter(c=>c.status == 'pending')
  const pendingLeaves = applications.filter(a=>a.status == 'pending')

  const today = new Date().toISOString().split("T")[0]; 

  const todaysAttendanceCount = attendance.filter(at => at.date.split(" ")[0] === today);

  const overdue = students.filter(st=> st.feesDue && new Date(st.feesDue) < new Date()).length


  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Room Occupancy',
      value: `${RoomsAssigned.length}/${Rooms.length}`,
      description: `${Math.round((RoomsAssigned.length / Rooms.length) * 100) || 0}% occupied`,
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Today\'s Attendance',
      value: todaysAttendanceCount.length,
      description: 'Students present',
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Complaints',
      value: pendingComplaints.length,
      description: 'Need attention',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Leave Applications',
      value: pendingLeaves.length,
      description: 'Pending approval',
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    
    {
      title: 'Overdue Payments',
      value: overdue,
      description: 'Need follow-up',
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

     {
      !student && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Urgent Actions Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingComplaints.length > 0 && (
              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="text-sm">High priority complaints</span>
                <Badge variant="destructive">{pendingComplaints.length}</Badge>
              </div>
            )}
            {0 > 0 && (
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                <span className="text-sm">Overdue payments</span>
                <Badge variant="secondary">{0}</Badge>
              </div>
            )}
            
            {pendingComplaints.length === 0 && 0 === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No urgent actions required 🎉
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bell className="h-5 w-5 text-blue-500 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                • {pendingLeaves.length} new leave applications
              </div>
            
              <div className="text-sm text-gray-600">
                • {pendingComplaints.length} complaints pending review
              </div>
             
            </div>
          </CardContent>
        </Card>
      </div>
      )
     }
    </div>
  )
}
import React, { createContext, useContext, useEffect, useState ,useMemo} from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const DataContext = createContext(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const logger = useMemo(() => {
    return JSON.parse(localStorage.getItem('User') || localStorage.getItem('adminCreds') || "null");
  }, []);
  
  const [students, setStudents] = useState<any[]>([]);
  const [Rooms, setRooms] = useState<any[]>([]);
  const [RoomsAssigned, setRoomsAssigned] = useState<any[]>([]);
  const [payments, setPayments] = useState([])
  const [attendance, setAttendance] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${baseURL}/student/get-students`);
      if (res.status === 200){
        setStudents(res.data) 
        console.log("Students",res);
      } 
    } catch (err) {
      setError("Failed to load students");
      toast({ title: "Students Not Found" });
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${baseURL}/room/get-rooms`);
      if (res.status === 200) {
        setRooms(res.data);
        console.log("Rooms",res);
        }
    } catch (err) {
      setError("Failed to load Rooms");
      toast({ title: "Rooms Not Found" });
    }
  };

  const fetchAssignedRooms = async () => {
    try {
      const res = await axios.get(`${baseURL}/room/get-assignment`);
      if (res.status === 200) {
        setRoomsAssigned(res.data);
        console.log("Assigned Rooms",res);
        }
    } catch (err) {
      setError("Failed to load Assigned Rooms");
      toast({ title: "Assigned Rooms Not Found" });
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${baseURL}/attendance/get-attendance`);
      if (res.status === 200) {
        setAttendance(res.data);
        console.log("Attendance",res);
        }
    } catch (err) {
      setError("Failed to load attendance");
      toast({ title: "Attendance Not Found" });
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${baseURL}/complaint/get-complaints`);
      if (res.status === 200) {
        setComplaints(res.data);
        console.log("Complaints",res);
        }
    } catch (err) {
      setError("Failed to load complaints");
      toast({ title: "Complaints Not Found" });
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${baseURL}/leave/get-leaves`);
      if (res.status === 200) {
        setApplications(res.data);
        console.log("Applications",res);
        }
    } catch (err) {
      setError("Failed to load applications");
      toast({ title: "Applications Not Found" });
    }
  };

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(`${baseURL}/visitors/get-visitors`)
      if (response.status===200) {
        setVisitors(response.data)
        console.log("List of Visitors",response)
      }
    } catch (error) {
      console.error('Failed to fetch Visitors:', error)
      setError('Failed to load Visitors')
      toast({
        title:"Visitors Not Found"
      })
    } 
  }

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${baseURL}/payment/get-payment`);
      if (res.status === 200) {
        setPayments(res.data);
        console.log("Payments",res);
        }
    } catch (err) {
      setError("Failed to load Payments");
      toast({ title: "Payments Not Found" });
    }
  };


  const run = async (fn) => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  };

  const refetchAll = async () => {
    await run(async () => {
      await Promise.all([fetchStudents(), fetchRooms(), fetchPayments(),fetchAssignedRooms(),fetchComplaints(),fetchAttendance(),fetchApplications(),fetchVisitors()]);
    });
  };

  refetchAll.students = () => run(fetchStudents);
  refetchAll.rooms = () => run(fetchRooms);
  refetchAll.payments = () => run(fetchPayments);
  refetchAll.attendance = () => run(fetchAttendance);
  refetchAll.application = () => run(fetchApplications);
  refetchAll.attendance = () => run(fetchAttendance);
  refetchAll.assignedRooms = () => run(fetchAssignedRooms);
  refetchAll.complaints = () => run(fetchComplaints);

  useEffect(()=>{
    refetchAll()
  },[logger])

  
  return (
    <DataContext.Provider
      value={{ students, Rooms, RoomsAssigned, attendance, complaints, applications,visitors, loading, error,payments, refetchAll }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used inside DataProvider");
  }
  return context;
};

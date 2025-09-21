import axios from "axios";
import React, { useRef, useState ,useEffect} from "react";
import { toast } from '@/hooks/use-toast';


const SelfieCapture: React.FC = () => {

const baseURL = import.meta.env.VITE_BACKEND_URL;

  const [mark,setMark] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null); 
  const [photo, setPhoto] = useState<string | null>(null);

  function getISTTime() {
    const now = new Date();
    const istOffset = 330; 
    const istTime = new Date(now.getTime() + istOffset * 60 * 1000);
  
    return istTime.toISOString().slice(0, 19).replace("T", " "); 
  }

  useEffect(() => {
    if (mark) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [mark]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream; 
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera not accessible:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop()); 
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png"); 
        setPhoto(dataUrl);
      }
    }
  };

const CAMPUS_LAT = 19.1139; 
const CAMPUS_LNG = 77.2975;  
const CAMPUS_RADIUS = 800;    
  
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; 
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    return R * c; 
  }
  const submit = async () => {
    if (!photo) return;
  
    try {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
        
          const distance = haversineDistance(latitude, longitude, CAMPUS_LAT, CAMPUS_LNG);

              const student = JSON.parse(localStorage.getItem("User")).student_details

              const dataToSend = {
                studentId:student.id,
                name:student.name,
                email:student.email,
                roomNo:student.room_assignment?.roomNo,
                location:distance<=CAMPUS_RADIUS? "Inside Campus":"Outside Campus",
                image:photo,
                date:getISTTime()
              }
        
      try {
        const response = await axios.post(`${baseURL}/attendance/mark-attendance`, dataToSend);
      
        if (response.status === 201) {
          console.log("✅ Attendance marked successfully:", response);
          toast({ title: "Attendance Marked!" });
        }
      } catch (error) {
          console.error("❌ Attendance marking failed:");
          toast({
            title: "Today's Attendance already marked",
            variant: "destructive",
          });
      } finally{
        setTimeout(()=>{
          window.location.reload();
        },1000)
      }        
          
    },
        (error) => {
          console.error("❌ Location access denied:", error);
        }
      );
    } catch (err) {
      console.error("Error marking attendance:", err);
      toast({
        title: "Attendance Marking Failed",
        variant: "destructive",
      });
    }
  };

  

  return (
    <div className="p-4 text-center">

    <button disabled={JSON.parse(localStorage.getItem('User'))?.warning > 3}
      onClick={ () =>{
        setMark(p=>!p)
        {false && (
          setTimeout(()=>{
            window.location.reload()
          },1000)
        )}
        }} className={`px-4 py-2 text-white rounded-lg m-2 ${mark ? "bg-red-600" : "bg-blue-600"}`}>
        {mark ? 'Cancel' : 'Mark Attendance' }
    </button>
         

{ mark && (
    <div className="flex flex-col items-center justify-center">
         {!photo ? (
           <>
             <video
               ref={videoRef}
               autoPlay
               playsInline
               className="w-84 h-84 bg-black rounded-xl"
             />
             <button
               onClick={takePhoto}
               className="px-4 py-2 bg-green-600 text-white rounded-lg mt-2"
             >
               Capture
             </button>
           </>
         ) : (
           <>
             <img
               src={photo}
               alt="Selfie"
               className="w-64 h-64 rounded-xl border"
             />
             <div className="space-x-5">
             <button
               onClick={() => setPhoto(null)}
               className="px-4 py-2 bg-red-600 text-white rounded-lg mt-2"
             >
               Retake
             </button>
             <button
               onClick={submit}
               className="px-4 py-2 bg-green-600 text-white rounded-lg mt-2"
             >
               Done
             </button>
             </div>
           </>
         )}
       </div>
    )
}
            
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SelfieCapture;

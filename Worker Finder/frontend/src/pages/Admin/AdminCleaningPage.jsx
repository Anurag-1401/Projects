import React, { useState , useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../pages/header'
import axios from 'axios'
import Cleaner from '../../logos/cleaner.jpg'
import '../../Styles/admin.css';
import Navi from '../../logos/greater-than-solid.svg';
import profile from '../../logos/smiling-young-man-illustration_1308-174401.avif'

const AdminCleaningPage = () => {

  const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [selectWorker, setSelectWorker] = useState('');
  const [errors,seterrors] = useState('');
  const [workers, setWorkers] = useState([]);
  const [newWorker, setNewWorker] = useState({
    workername: "",
    contact: "",
    address: "",
    experience: "",
    specialty: "",
    adminId: user.id,

  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                const adminId = user?.id; 
                if (!adminId) {
                    console.error("Admin ID is missing");
                    return;
                }

                const response = await axios.get(`${baseURL}/api/getcleaner/${adminId}`, {
                    params: { latitude, longitude }
                });

                setWorkers(response.data.workers);
            } catch (error) {
                console.error("Error fetching workers:", error);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};

  const handleChange = (e) => {
    setNewWorker({ ...newWorker, [e.target.name]: e.target.value });
  };

  const handleAddWorker = async () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                const response = await axios.post(`${baseURL}/api/addcleaner`, {
                    ...newWorker,
                    location: { latitude, longitude }, 
                });

                setWorkers([...workers, response.data]);
                setNewWorker({ workername: "", contact: "", address: "", experience: "", specialty: "" });
                fetchWorkers();
            } catch (error) {
                seterrors(error.response.data.message);
                console.error("Error adding worker:", error);
                alert('Please fill out all fields.');
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};


  const handleDeleteWorker = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/deletecleaner/${id}`);
      setWorkers(workers.filter((worker) => worker._id !== id));
      setSelectWorker('');
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  const opencard = (worker) => {
          setSelectWorker(worker);
  }

  const closecard = () => {
    setSelectWorker('');
  };
  const handleOpenPaymentPage = () =>{
    navigate('/payments' , {
      state : {
        user : user,
        worker : selectWorker
      }
    })
  }

  return (
    <div className='admin-page'>
      <div>
        {Header()}
      </div>
      <div className="admin-container">
        <div className='heading'>
        Manage Cleaners
        </div>
        <div className='line'></div>
      
         <div className='add'>
         <h3>Add New Cleaner</h3>
          <input type="text" name="workername" placeholder="Name" value={newWorker.workername} onChange={handleChange} required className="admin-input" />
          <input type="text" name="contact" placeholder="Contact" value={newWorker.contact} onChange={handleChange} required className="admin-input" />
          <input type="text" name="address" placeholder="Address" value={newWorker.address} onChange={handleChange} required className="admin-input" />
          <input type="text" name="experience" placeholder="Experience" value={newWorker.experience} onChange={handleChange} required className="admin-input" />
          <input type="text" name="specialty" placeholder="Specialty" value={newWorker.specialty} onChange={handleChange} required className="admin-input" />
          <button onClick={handleAddWorker} className="admin-add-btn">Add Worker</button>
          <p style={{color:'red',fontWeight:'700',marginTop:'10px'}}>{errors}</p>
          </div>
       </div>

  <div className="list-container">
  <h2 className='heading'>List of Cleaners</h2>
  <div className='line'></div>
  {workers.length > 0 ? (
    <table className="worker-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Address</th>
          <th>Experience (years)</th>
          <th>Specialty</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody className='body'>
        {workers.map((worker, index) => (
          <tr key={index} className="worker-row">
            <td>{worker.workername}</td>
            <td>{worker.contact}</td>
            <td>{worker.address}</td>
            <td>{worker.experience}</td>
            <td>{worker.specialty}</td>
            <td >
            <img className='navi' src={Navi} alt="" onClick={()=>opencard(worker)} />
                                               
                     </td>
    
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="admin-no-workers">No Cleaners available.</p>
            )}
          </div>
    
          <img className="img" src={Cleaner} alt="Plumber" />
    
           {selectWorker && (
            <div className="worker-card">
              <div className="worker-card-content">
                <div className="profile-pic">
                    <img src={profile} alt="Profile" />
                 </div>
                <span className="close-btn" onClick={closecard}>
                  &times;
                </span>
                <h3 style={{marginLeft:'100px'}}>{selectWorker.workername}</h3>
                <p>📍 <span style={{fontWeight:'bolder'}}>Address:</span> {selectWorker.address}</p>
                <p>📞 <span style={{fontWeight:'bolder'}}>Contact:</span>  {selectWorker.contact}</p>
                <p>🛠 <span style={{fontWeight:'bolder'}}>Specialty:</span> {selectWorker.specialty}</p>
                <p>⭐ <span style={{fontWeight:'bolder'}}>Experience:</span>  {selectWorker.experience} years</p>
                <p>⭐<span style={{fontWeight:'bolder'}}>Ratings:</span>{selectWorker.averageRating}</p>
                </div>
                 
                 <div style={{display:'flex',justifyContent:'space-around',marginTop:'20px',marginLeft:'-40px'}}>
                <button style={{display:'block',position:'relative',left:'32px'}} onClick={() => window.location.href = `tel:${selectWorker.contact}`} 
                       className="contact-btn">Call</button>

                   <button className='delete-btn' style={{backgroundColor:'goldenrod' , marginLeft:"28px"}} 
                   onClick={handleOpenPaymentPage}>Payments</button>

                       <button className='delete-btn' onClick={() => handleDeleteWorker(selectWorker._id)} >Delete</button>
                </div>
            </div>
          )}
        </div>
      );
    };

export default AdminCleaningPage;

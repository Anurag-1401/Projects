import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice';
import profile from '../logos/smiling-young-man-illustration_1308-174401.avif'
import axios from 'axios';
import '../Styles/UserProfile.css';

const UserProfile = () => {

  const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const dispatch = useDispatch();
  const user = useSelector((state)=> state.auth.user);
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

const togglePassword = () => {
  setShowPassword(!showPassword);
};


  useEffect(() => {
    fetchUserData();
  },[]);

    const fetchUserData = async () => {
      try {
         const response = await axios.get(`${baseURL}/api/profile/${user.id}`); 
          setUserData(response.data);
         } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
       }
    };
   
    const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/');
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`${baseURL}/api/delete/${user.id}`);
      alert("Account Deleted Successfully!");
      handleLogout();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <div className="profile-details">
        <div className="profile-pic">
          <img src={profile} alt="Profile" />
        </div>
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p><strong>Phone:</strong> {user.mobileNumber}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.role == "admin" ? 
          (<p><strong>Category:</strong> {user.categories}</p>) : ("")
          }
          <div className='pass'>
          <p><strong>Password:</strong> {showPassword ? user.password : "*******"}</p>         
          <button className='back'
           style={{marginLeft:'10px',height:'25px',backgroundColor:'black',borderRadius:'5px',color:'white',width:'40px',cursor:'pointer'}}
          onClick={togglePassword}>
          {showPassword ? "Hide" : "Show"}
          </button>
            </div>
            <button className='back'
            style={{marginTop:'10px',width:'40px',height:'25px',borderRadius:'5px',cursor:'pointer',display:'block'}}
             onClick={() => {user.role==="admin" ? navigate(`/admin/${user.categories}`) : navigate('/')}}>Back</button>

             <button style={{marginTop:'10px'}} className="logout-btn" onClick={deleteUser}>Delete Account</button>
           </div>
        </div>
      </div>
  );
};

export default UserProfile;

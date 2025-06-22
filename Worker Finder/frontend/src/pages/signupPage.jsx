import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/signup.css';

const SignupPage = () => {

  const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    role: 'user',
    category: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [show,setShow] = useState(true);

  const validateField = (name,value) => {

    let error = "";

    if (name === "name") {
      if (!value) error = "Name is required";
      else if (!/^[a-zA-Z]{3,10}$/.test(value)) error = "Name must be 3-10 letters (alphabets only)";
    }

    if (name === "mobileNumber") {
      if (!value) error = "Mobile Number is required";
      else if (!/^[6789]\d{9}$/.test(value)) error = "Invalid mobile number";
    }

    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) error = "Enter a valid email address";
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
        error = "Password must have 8+ chars, 1 uppercase, 1 number, 1 special char";
      }
    }

    if (name === "confirmPassword") {
      if (!value) error = "Confirm Password is required";
      else if (value !== form.password) error = "Passwords do not match";
    }

    if (name === "category" && form.role === "admin") {
      if (!value || value.length === 0) error = "Category is required for Admin role";
    }

    return error;

  } 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (touched[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, value),
      }));
    }
    };

    const handleBlur = (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: validateField(name, value) }));
    };

    const validateForm = () => {
      const newErrors = {};
      Object.keys(form).forEach((key) => {
        newErrors[key] = validateField(key, form[key]);
      });
      setErrors(newErrors);
      return Object.values(newErrors).every((error) => !error);
    };

    const sendOtp = async () => {
        
        
        try {
          await axios.post(`${baseURL}/api/send-otp`, { email:form.email , phone:form.mobileNumber});
          setOtpSent(true);
          alert("OTP sent successfully!");
        } catch (error) {
          alert("Error sending OTP");
        } finally {
          setLoading(false);
        }
      };
    
      const verifyOtp = async () => {
        if (!form.otp) return alert("Please enter OTP");
    
        try {
          const response = await axios.post(`${baseURL}/api/verify-otp`,{ email:form.email , phone:form.mobileNumber , otp:form.otp});
          alert(response.data.message);
          setShow(false);
        } catch (error) {
          console.log(error);
          alert("Invalid OTP");
        }
      };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const userData = {
            ...form,
            category: form.role === "admin" ? form.category : undefined,
            location: { latitude, longitude },
          };

          const response = await axios.post(`${baseURL}/api/register`, userData);

          if (response.status === 201) {
            alert('Account created successfully!');
            console.log('User created:', response.data);
            navigate('/login');
          } else {
            console.error('Unexpected response status:', response.status);
          }
        } catch (error) {
          console.error('Error during signup:', error);
          if (error.response) {
            console.error('Server Response:', error.response.data);
            setErrors({ form: error.response.data.message || "Something went wrong!" });
          } else {
            console.error('Unknown error:', error);
          }
        } finally {
          setLoading(false);
        }
      }, (error) => {
        setLoading(false);
        alert("Location access denied! Please allow location to proceed.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  const loginclick = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <h2 style={{ color: 'black', marginTop: '0px', paddingBottom: '20px' }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="Full Name" />
        {touched.name && errors.name && <p className="error">{errors.name}</p>}

        <label>Mobile Number</label>
        <input type="text" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} onBlur={handleBlur} placeholder="Mobile Number" />
        {touched.mobileNumber && errors.mobileNumber && <p className="error">{errors.mobileNumber}</p>}
        
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="Email Address" />
        {touched.email && errors.email && <p className="error">{errors.email}</p>}

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} placeholder="Password" />
        {touched.password && errors.password && <p className="error">{errors.password}</p>}

        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur}  placeholder="Confirm Password" />
        {touched.confirmPassword && errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <label style={{ marginBottom: '5px' }}>Role</label>
        <select name="role" value={form.role} onChange={handleChange} style={{ height: '25px', borderRadius: '5px', color: 'white', backgroundColor: '#435a83' }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === 'admin' && (
          <>
            <label>Category (for Admins)</label>
            <select name="category" value={form.category} onChange={handleChange} onBlur={handleBlur} style={{ height: '25px', borderRadius: '5px', color: 'white', backgroundColor: '#435a83', marginTop: '10px' }}>
              <option value="">Select Category</option>
              <option value="plumber">Plumber</option>
              <option value="carpenter">Carpenter</option>
              <option value="electrician">Electrician</option>
              <option value="painter">Painter</option>
              <option value="cleaner">Cleaner</option>
              <option value="mason">Mason</option>
            </select>
            {touched.category && errors.category && <p className="error">{errors.category}</p>}
          </>
        )}
       
       { show && (
        <>
        <label>OTP Verification</label>
        <select style={{ height: '25px', borderRadius: '5px', color: 'white', backgroundColor: '#435a83', marginRight:'10px' , marginTop:'5px'}}>
          <option value="email">Email</option>
          <option value="mobileNumber">Mobile</option>
        </select>
        <button className="send-btn" type="button" onClick={sendOtp} disabled={loading}>Send OTP</button>
        
        {otpSent && (
          <>
            <input style={{width:'100px'}} type="text" name="otp" value={form.otp} onChange={handleChange} placeholder="Enter OTP" />
            <button className="send-btn" type="button" onClick={verifyOtp} disabled={loading}>Verify OTP</button>
          </>
        )}
        </>
      )}
        <p style={{ color: 'red', fontWeight: '700', marginTop: '10px' }}>{errors.form}</p>

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <p>Already Have an Account? <button type="submit" className="login-btn" onClick={loginclick}>Login</button></p>
    </div>
  );
};

export default SignupPage;
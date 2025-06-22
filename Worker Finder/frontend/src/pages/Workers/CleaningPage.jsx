import React , {useEffect,useState}from 'react';
import { useSelector } from 'react-redux';
import axios from "axios"
import '../../Styles/WorkerList.css';
import Navi from '../../logos/greater-than-solid.svg';
import profile from '../../logos/smiling-young-man-illustration_1308-174401.avif'


const CleaningPage = () => {

  const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const user = useSelector((state) => state.auth.user);
  const [workers,setWorkers] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
    const [submittedRating, setSubmittedRating] = useState({});
    const [selectWorker, setSelectWorker] = useState('');
      const [box,setBox] = useState(false);
      const [amount,setAmount] = useState(0);

  useEffect(() => {
    fetchWorkers();
  }, []);
  
  const fetchWorkers = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

    try {
      const response = await axios.get(`${baseURL}/api/getcleaner/all`, {
        params: { latitude, longitude }
      });
      setWorkers(response.data.workers);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  })
}
};

  
  const opencard = (worker) => {
    setSelectWorker(worker);
}

const closecard = () => {
setSelectWorker('');
};

const handleRating = (rating) => {
  setSelectedRating(rating);
};

const submitRating = async (workerId) => {
  if (!selectedRating) {
    alert("Please select a rating before submitting!");
    return;
  }
  try {
    await axios.post(`${baseURL}/api/ratecleaner/${workerId}`, { rating: selectedRating });
    setSubmittedRating((prev) => ({ ...prev, [workerId]: true }));     alert("Rating submitted successfully!");
    fetchWorkers(); 
  } catch (error) {
    console.error("Error submitting rating:", error);
    alert("Failed to submit rating.");
  }
};

const handleChange = (e) =>{
  setAmount(e.target.value);
}

const loadRazorpayScript = () => {
return new Promise((resolve) => {
const script = document.createElement("script");
script.src = "https://checkout.razorpay.com/v1/checkout.js";
script.onload = () => resolve(true);
script.onerror = () => resolve(false);
document.body.appendChild(script);
});
};


const handlePayment = async () => {
const res = await loadRazorpayScript();

if (!res) {
alert("Failed to load Razorpay SDK");
return;
}
setBox(false);
const { data } = await axios.post(`${baseURL}/api/create-order` , {amount : amount});

const options = {
key: "rzp_test_jqGmQ1R8KhN9US",
amount: data.amount,
currency: "INR",
name: "Worker Finder",
description: "Payment for Worker",
order_id: data.id,
handler: async function (response) {
alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

await axios.post(`${baseURL}/api/add-payment`, {
adminId : selectWorker.adminId,
username : user.name,
userContact : user.mobileNumber,
payment_id: response.razorpay_payment_id,
order_id: response.razorpay_order_id,
signature: response.razorpay_signature,
amount: data.amount / 100,
workerId: selectWorker._id,
method: "razorpay",
});
},
theme: {
color: "#3399cc",
},
};

const paymentObject = new window.Razorpay(options);
paymentObject.open();
};

  return (
    <div>
    <h2>Available Cleaners</h2>
    <div className="worker-list-container">
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
        <tbody>
          {workers.map((cleaner, index) => (
            <tr key={index} className="worker card">
              <td>{cleaner.workername}</td>
              <td>{cleaner.contact}</td>
              <td>{cleaner.address}</td>
              <td>{cleaner.experience}</td>
              <td>{cleaner.specialty}</td>
              <td>
                 <img className='navi' src={Navi} alt="" onClick={()=>opencard(cleaner)} />
                                                                             
                  </td>
  
                 </tr>
               ))}
             </tbody>
           </table>
       </div>
                   
        {selectWorker && (
         <div style={{position:'absolute', top:'200px', left:'750px'}}className="worker-card">
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

             {submittedRating [selectWorker._id] ? (
             <p style={{ fontWeight: '800', color: 'gray', marginLeft: '50px' }}>Already Rated</p> 
              ) : (
             <div className="rating-section">
             <p><span style={{ fontWeight: '800',color:'gery',marginLeft:'50px' }}>Rate this Worker</span></p>
              <div className="star-rating" style={{marginLeft:'65px'}}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRating(star)}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      color: star <= selectedRating ? "gold" : "gray",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              {submittedRating [selectWorker._id] ? (
                <p style={{marginLeft:'50px'}}>Thanks for rating!</p>
              ):(<button style={{marginLeft:'70px'}} className="submit-rating-btn" onClick={() => submitRating(selectWorker._id)} disabled={submittedRating===0}>
                Submit Rating
            </button>)}
              
             </div>
              )}
             </div>
              
              <div style={{display:'flex',justifyContent:'space-around',marginTop:'20px',marginLeft:'-40px'}}>
             <button style={{display:'block',position:'relative',left:'10px'}} onClick={() => window.location.href = `tel:${selectWorker.contact}`} 
                    className="contact-btn">Call</button>
            
            <button style={{display:'block',position:'absolute',right:'70px'}}className="contact-btn" onClick={() => {setBox(true)} }>Pay</button>;

             </div>
             {box &&
              (
              <div style={{marginLeft:'80px',marginTop:'10px'}}>
              <input type="text" onChange={handleChange} placeholder="Enter Amount" />
              <button className="send-btn" type="button" onClick={handlePayment} >Proceed</button>
              </div>
              )
            }
         </div>
       )}
     </div>
   );
  };

export default CleaningPage;

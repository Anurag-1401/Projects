import React from 'react';
import { useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import axios from "axios"
import '../Styles/home.css';
import { useNavigate } from 'react-router-dom';
import plumbing from '../logos/plumb.svg';
import carpenter from '../logos/carpenter.svg';
import electric from '../logos/electric.svg';
import mason from '../logos/mason.svg'
import paint from '../logos/painting.svg'
import clean from '../logos/clean.png'
import logoo from '../logos/logoo.png'
import pro from '../logos/user.svg';
import flag from '../logos/india.png'
import loc from '../logos/location-crosshairs-solid.svg'
import globe from '../logos/globe-solid.svg';
import noti from '../logos/bell-solid.svg';
import search from '../logos/magnifying-glass-solid.svg';
import help from '../logos/circle-info-solid.svg'


const categories = [
    { name: "Plumbing", image: plumbing, path: "/plumber" },
    { name: "Carpentry", image: carpenter, path: "/carpenter" },
    { name: "Electrical", image: electric, path: "/electrician" },
    { name: "Mason", image: mason, path: "/mason" },
    { name: "Painting", image: paint, path: "/painter" },
    { name: "Cleaning", image: clean, path: "/cleaner" },
  ];
  
  const Header = () => {

    const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const user = useSelector((state)=> state.auth.user);
    const navigate = useNavigate();

    const [locationName, setLocationName] = useState("");
  
    const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");

  const handleChatToggle = () => {
    setShowChat(!showChat);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      alert("📩 Your message has been sent! Our team will respond soon.");
      setMessage("");
      setShowChat(false);
    }
  };

  
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const placeholderTexts = [
      'Search by "Name"',
      'Search by "Contact"',
      'Search by "Eamil"',
      'Search by "Address"',
    ];
  
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
  
          try {
              const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                  params: {
                      lat: latitude,
                      lon: longitude,
                      format: "json",
                  },
              });
  
              const address = response.data.display_name;
              setLocationName(address);
          } catch (error) {
              console.error("Error fetching location:", error);
          }
      });
  }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderTexts.length);
      }, 1500);
      return () => clearInterval(interval); 
    }, []);

const [searchQuery, setSearchQuery] = useState('');
const [filteredSuggestions, setFilteredSuggestions] = useState([]);
const [workers,setWorkers] = useState([]);

useEffect(() => {
  const fetchWorkers = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
    try {
      const response = await axios.get(`${baseURL}/api/get${user.categories}/${user.id}`, {
        params: { latitude, longitude }
    });
      setWorkers(response.data);
   
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
    }
    )};
    };

  fetchWorkers();
}, []);
  
const handleSearchChange = (e) => {
  const query = e.target.value;
  setSearchQuery(query);
  if (query.length > 0) {
    const filtered = workers.filter((worker) =>
      worker.workername.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  } else {
    setFilteredSuggestions([]);
  }
};

const handleSearchClick = () => {
  if (filteredSuggestions.length > 0) {
    navigate(`/worker/${filteredSuggestions[0].id}`);
  }
};

  const handleSuggestionClick = (path) => {
  user ? navigate(path) : navigate('/signup')
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };


 return(
 <header>
        <div className="header-container">
          <div className="logo">
            <img src={logoo} alt="Worker-Finder Logo" />
          </div>

          
        <div className='location'>
                  <img style={{height:'30px',width:'30px'}} src={loc} alt="" />
                <div className="country">
                  <div className="country-img">
                    <img src={flag}/>
                  </div>
                  {locationName ? (
                        // <p>{locationName.split(",").slice(0,2).join(", ")}</p>
                        <p style={{fontWeight:"600"}}>{locationName.split(",")[0]}</p>
                    ) : (
                        <p style={{fontWeight:"600"}}>Fetching location...</p>
                    )}
                </div>
                </div>

        <div className="lang-pan3">
        <img style={{height:'25px',width:'25px'}} className='globe' src={globe} alt="" />
          <select style={{outline:'none'}} className="pan3-select">
            Languague
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
            <option>Urdu</option>
          </select>
        </div>


          <div className="search-box">
            <div className="categoryd">
            <select style={{outline:'none', cursor:'pointer'}} className="categorys"  >
              <option>All</option>
              <option>Plumbing</option>
              <option>Carpentry</option>
              <option>Electrical</option>
              <option>Painting</option>
              <option>Mason</option>
              </select>
              </div>

            <input type="text" id="search" placeholder={placeholderTexts[placeholderIndex]}
            value={searchQuery}
            onChange={handleSearchChange}/>
              <div id="suggestions" className="suggestions">
            {filteredSuggestions.length > 0 && searchQuery && (
              <ul>
                {filteredSuggestions.map((category) => (
                  <li key={category.name} onClick={() => handleSuggestionClick(category.path)}>
                    <img src={category.image} alt={category.name} />
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
            </div>
            <button className="search-btn" onClick={handleSearchClick}><img style={{height:'25px',width:'25px'}} src={search} alt="" /></button>
          </div>

          <div className="profile">
          
              <img src={pro} alt="User Profile" onClick={handleProfileClick} />
              </div>


          <div className='notification'>
                               <img style={{height:'35px',width:'35px'}}  src={noti} alt="" />
                               <div className='updates'>
                                <h1 style={{fontSize:'20px', color:'black', textAlign:'center'}}>Updates:-</h1>
                                 <ul id="notification-list">
                                   <li>🚀 New feature added: Dark Mode!</li>
                                   <li>📢 Maintenance scheduled for March 5th.</li>
                                   <li>🎉 Special discount on premium plans.</li>
                                 </ul>
                               </div>
                      </div>  
                      
                      <div className='help'>
                        <img src={help} style={{height:'35px',width:'35px'}}  alt="" />
                        <div className='ihelp'>
                                <h1 style={{fontSize:'20px', color:'black', textAlign:'center'}}>Contact Us:-</h1>
                                 <p style={{color:'black',fontSize:'18px',marginTop:'10px'}}>Need help? Our support team is here for you!</p>
           
                                   <div className="contact-info">
                                     <p style={{fontSize:'18px',marginBottom:'10px'}}>📱 Customer Care: <strong style={{color:"black"}}>+91 98765 43210</strong></p>
                                     <p style={{fontSize:'18px',marginBottom:'15px'}}>📧 Email: <strong style={{color:'black'}}>support@example.com</strong></p>
                                   </div>
                                   
                                   <div style={{display:'flex'}}>
                                   <p style={{fontSize:'18px',marginBottom:'10px',color:'black'}}> <strong>💬 Or Want To Chat: </strong></p>
                                   <button className="chat-btn" onClick={handleChatToggle}>
                                     💬 Chat with Us
                                   </button>
                                   </div>
                             
                                   {showChat && (
                                     <div className="chat-box">
                                       <p style={{color:'black',fontSize:'15px'}}>Welcome! How can we help you?</p>
                                       <input
                                         type="text"
                                         placeholder="Type your message..."
                                         value={message}
                                         onChange={(e) => setMessage(e.target.value)}
                                       />
                                       <button className="send-btn" onClick={handleSendMessage}>
                                         Send
                                       </button>
                                     </div>
                                   )}
                                                  </div>
                                           </div>  
         
        </div>
      </header>
 );

};

export default Header;
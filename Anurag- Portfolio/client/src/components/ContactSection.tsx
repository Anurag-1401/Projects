
import { useState ,useEffect} from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram,Home } from 'lucide-react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const ContactSection = () => {

   const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;


const handleClick = () => {
      const btn = document.getElementById('confettiBtn');
      if (btn) {
        party.confetti(btn, {
          count: party.variation.range(40, 60),
          spread: 70,
          speed: party.variation.range(500, 800),
        });
      }
    };

   

  const navigate = useNavigate()

  const [profileData, setProfileData] = useState({
    email: '',
    contact: '',
    location: '',
    github: '',
    linkedin: '',
    insta: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    location:''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


   
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    
      return;
    }

    try {
    const response = await axios.post(`${baseUrl}/api/send-mail`, formData)
      if(response.status == 201){

      handleClick();
      console.log(response.data.message);
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });

    setTimeout(() => {
      window.location.reload()
    }, 1000);

    } else {
      console.log('Unable to sned the form!')
      toast({
        title: "Message not sent!",
        description: "An unexpected error occurs , try again!",
      });
    }
  } catch (error){
    console.error('Error during sending:', error);
          if (error.response) {
            console.error('Server Response:', error.response.data);
        }
   }

   setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      location:''
    });
  };


  useEffect(()=>{
    fetchAdmin();
  },[])

  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`${baseUrl}http://localhost:5000/api/getAdminDetails`)
      if (response.status == 200) {
        setProfileData(response.data.Admin)
        console.log(response)
      }
    } catch (error) {
      
    }
  };



  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: profileData.email,
      link: profileData.email
    },
    {
      icon: Phone,
      title: 'Phone',
      value: profileData.contact,
      link: `tel:${profileData.contact}`
    },
    {
      icon: MapPin,
      title: 'Location',
      value: profileData.location,
      link: 'https://www.google.com/maps/place/Shri+Guru+Gobind+Singhji+Institute+of+Engineering+and+Technology/@19.1039538,77.2842938,14.65z/data=!4m6!3m5!1s0x3bce29b9903d053d:0x2c5238a90ab55c03!8m2!3d19.1116086!4d77.2930292!16s%2Fm%2F027z39w?entry=ttu&g_ep=EgoyMDI1MDcxNS4xIKXMDSoASAFQAw%3D%3D'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      name: 'GitHub',
      url: profileData.github,
      color: 'hover:text-gray-400'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      url: profileData.linkedin,
      color: 'hover:text-blue-400'
    },
    {
      icon: Instagram,
      name: 'Instagram',
      url: profileData.insta,
      color: 'hover:text-blue-400'
    },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Button
     onClick={() => {
       navigate("/",{replace:true});
     }}

  className="mb-10 flex items-center gap-3 px-8 py-6 bg-blue-600/20 text-white rounded-full shadow-lg hover:bg-white hover:text-lg hover:text-black hover:shadow-xl transition-all duration-300 transform hover:scale-105"
>
  <Home className="w-6 h-6 text-blue-400" />
</Button>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          


          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
              <p className="text-white/70 leading-relaxed mb-8">
                Whether you have a project in mind, want to collaborate, or just want to say hello, 
                I'd love to hear from you. Feel free to reach out through any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          <info.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{info.title}</h4>
                          <a 
                            href={info.link}
                            target='main'
                            className="text-white/70 hover:text-blue-400 transition-colors duration-300"
                          >
                            {info.value}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
</div>

            
            
    
    {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-white/5 border border-white/10 rounded-lg text-white/60 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/10`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

    
    
    {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Send Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-white/80 text-sm font-medium mb-2 block">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-white/80 text-sm font-medium mb-2 block">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="text-white/80 text-sm font-medium mb-2 block">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="text-white/80 text-sm font-medium mb-2 block">
                      Location
                    </label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                      placeholder="What's your location?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="text-white/80 text-sm font-medium mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 resize-none"
                      placeholder="Tell me about your project or just say hello..."
                      required
                    />
                  </div>
                  
                  <Button id="confettiBtn"
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default ContactSection;

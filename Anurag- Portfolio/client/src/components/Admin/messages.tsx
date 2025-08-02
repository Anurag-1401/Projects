import { useState , useEffect } from 'react';
import { Card, CardContent, CardHeader, } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Reply,Pencil,Trash2, Send} from 'lucide-react';
import axios from 'axios';
import party from 'party-js'


const Messages = () =>{

    const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    
    const [messages,setMessages] = useState('');
    const [reply, setReply] = useState(false);
    const [selectMsg, setSelectMsg] = useState([]);
    const[send,setSend] = useState(false)
    const [isEdit,setisEdit] = useState(false)
    const [isDelete,setisDelete] = useState(false)
    const [disabled, setDisabled] = useState(true);
    const [isCheck,setisCheck] = useState(false)
    const [isbtn,setisbtn] = useState(false)
    const [activeBtn, setActiveBtn] = useState("");
  
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

    
    useEffect(()=>{
        fetchMessages();
    },[])

    const fetchMessages = async () =>{
        try {
            const response =await axios.get(`${baseUrl}/api/get-form`)
            if(response.status == 200){
                setSelectMsg(response.data.Messages);
                console.log(response.data.Messages);
            }else{
              console.log("Messages Not Found");
            }
        } catch (error) {
          console.error("Error fetching Messages:", error);
          toast({
            title: "No messages Available",
          });
        }
    };

const handleDeleteMessage = async (id:string) => {
  setisDelete(false);
  setActiveBtn('');
  try {
    const response = await axios.delete(`${baseUrl}/api/del-form/${id}`);
    if(response.status == 200){
      console.log("Message Deleted",response.data.Msg);

      toast({
        title: "Message Deleted",
        description: "The Message has been removed from your portfolio.",
      });

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    else {
      console.log("Not Deleted, Something went wrong")
    }

  } catch (error) {
    console.log("Error",error.message)
  }
};


const handleSendMail = async (messageObj) => {
  try {
    const data = {
      ...messageObj,
      message:messages
    }
    const response = await axios.post(`${baseUrl}/api/sendreply-mail`,data);
    if(response.status == 201){
      console.log(response.data.message,response.data.mail);

      toast({
        title: "Mail Sent",
        description: "The Mail has been sent to the client",
      });

      handleClick();


      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } 

    else {
      console.log("Not Sent, Something went wrong")
    }


  } catch (error) {
    console.log("Error",error.message)
  }
};

    return(
      <div>
  <div className='mb-10 pt-10 px-4 md:px-10'>
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
      Your Inbox
    </h1>
    <p className="text-white/70">
      Manage and reply to your messages here
    </p>
  </div>

  <Card className="bg-white/5 border-white/10 backdrop-blur-sm mx-4 md:mx-10">
    {selectMsg.length > 0 ? (
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setisEdit(prev => !prev);
              setisCheck(false);
              setDisabled(false);
              setisDelete(false);
              if (isEdit) {
                setTimeout(() => window.location.reload(), 500);
              }
            }}
            className={`border px-3 py-2 text-sm ${
              isEdit
                ? 'text-red-400 border-red-400 hover:bg-red-400/10'
                : 'text-blue-400 border-blue-400 hover:bg-blue-400/10'
            }`}
          >
            <Pencil className="w-4 h-4 mr-1" />
            {isEdit ? "Cancel" : "Reply"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setisDelete(prev => !prev);
              setDisabled(false);
              setisEdit(false);
              if (isDelete) {
                setTimeout(() => window.location.reload(), 500);
              }
            }}
            className="border-red-400/50 text-red-400 hover:bg-red-400/10"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {isDelete ? "Cancel" : "Delete"}
          </Button>
        </div>
      </CardHeader>
    ) : (
      <div className="flex items-center justify-center mt-5">
        <h3 className="text-center text-white/80 text-md font-medium">No Messages</h3>
      </div>
    )}

    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectMsg.map((message, index) => (
          <div
            key={index}
            className="p-4 bg-white/5 rounded-lg border border-white/10 w-full max-w-full"
          >
            <div className='flex items-center justify-between'>
              <h4 className="text-white font-semibold text-lg flex-grow">{message.name}</h4>
              <input
                className="ml-4 w-4 h-4 rounded-full appearance-none border border-white/50 outline-none bg-transparent checked:bg-purple-500"
                disabled={disabled}
                type="checkbox"
                onChange={(e) => {
                  setActiveBtn(message.name);
                  setisCheck(e.target.checked);
                  setisbtn(true);
                }}
              />
            </div>

            <p className="text-blue-400 font-medium mb-2 break-words">{message.email}</p>
            <p className="text-white/60 text-sm mb-1">{message.subject}</p>
            <p className='text-white mt-4 mb-1'>Message:</p>
            <p className="text-white/70 mb-2 break-words">{message.message}</p>
            <p className='text-white mt-3 mb-1'>Location:</p>
            <p className="text-white/70 mb-2 break-words">{message.location}</p>

            {activeBtn === message.name && isbtn && !isDelete && !reply && (
              <Button
                disabled={!isEdit}
                onClick={() => setReply(true)}
                className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Reply className="w-4 h-4" />
                Reply
              </Button>
            )}

            {activeBtn === message.name && isCheck && isDelete && (
              <button
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-xl shadow-md transition duration-200"
                onClick={() => handleDeleteMessage(message._id)}
              >
                Delete
              </button>
            )}

            {reply && activeBtn === message.name && (
              <div className="mt-4">
                <Textarea
                  disabled={!isEdit}
                  value={messages}
                  onChange={(e) => {
                    setMessages(e.target.value);
                    setSend(true);
                  }}
                  className="bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-1 focus:ring-purple-500"
                  placeholder="Reply here"
                  rows={3}
                />
              </div>
            )}

            {activeBtn === message.name && send && (
              <Button  id="confettiBtn"
                disabled={!isEdit}
                onClick={() => {handleSendMail(message);
                }}
                className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>


);
};

export default Messages;

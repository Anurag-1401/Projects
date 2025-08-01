const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSKEY
    }
});



const Mail = require('../Models/MailModel')
const ReplyMail = require('../Models/replyMailModel')

const newMail = async (req , res) => {
    const {name , email , subject , message , location} = req.body

    try {
        const newForm = new Mail({name , email , subject , message,location})
        await newForm.save()

        const mailOptions = {
            from:email,
            to:process.env.EMAIL,
            subject,
            text:message,
        };
 
        transporter.sendMail(mailOptions, (error) => {
                if (error) console.error("Email error:", error);
                else res.status(200).json({Message:"Email sent",Mail:mailOptions})
        });
        res.status(201).json({message : 'Mail sent' , mail:newForm})

    } catch (err) {
        console.log(err,req.body);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


const newReplyMail = async (req , res) => {
    const {name,email, message,location} = req.body

    try {
        const newForm = new ReplyMail({name,email, subject:"Reply to your mail" , message,location})
        await newForm.save()

        const mailOptions = {
            from:process.env.EMAIL,
            to:email,
            subject:"Reply to your mail",
            text:message,
        };
 
        transporter.sendMail(mailOptions, (error) => {
                if (error) console.error("Email error:", error);
                else res.status(200).json({Message:"Email sent",Mail:mailOptions})
        });
        res.status(201).json({message : 'Mail sent' , mail:newForm})

    } catch (err) {
        console.log(err,req.body);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


const getForm = async (req,res) => {
    try {
        let messages = await Mail.find()

        if(messages.length > 0){
            res.status(200).json({Messages:messages})
        } else {
            res.status(404).json({Message : "Messages not found"})
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const delForm = async (req,res) => {
    const {id} = req.params;
    try {
  let form = await Mail.findByIdAndDelete(id);
  if(!form) {
      return res.status(404).json({message:"Message not found"});
  } else {
      res.status(200).json({message:"Message Deleted!",Msg:form})
  }
       } catch (error) {
           res.status(500).json({message:"Server Error",error})
       }
};

module.exports = {newMail,newReplyMail,getForm,delForm}
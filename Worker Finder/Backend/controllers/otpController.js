const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const twilio = require("twilio");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");


const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const generateOTP = () => otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
const otpStore = {};

const sendOtp = async (req, res) => {
    try {
        const { email, phone } = req.body;
        if (!email && !phone) return res.status(400).json({ message: "Email or Phone required" });

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60000);

        if (email) otpStore[email] = { otp, otpExpiry };
        if (phone) otpStore[phone] = { otp, otpExpiry };

        if (email) {
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) console.error("Email error:", error);
            });

            
        }

        if (phone) {
            try {
                await twilioClient.messages.create({
                    body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: phone
                });
            } catch (error) {
                console.error("SMS error:", error);
            }
        }

        res.status(200).json({ message: "OTP sent successfully",otp });
    } catch (error) {
        console.error("Error in send-otp:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, phone, otp} = req.body;

        if (!otp) return res.status(400).json({ message: "OTP is required" });

        const key = email || phone;
        const storedOtpData = otpStore[key];

        if (!storedOtpData) {
            return res.status(400).json({ message: "OTP not found or expired" });
        }

        if (storedOtpData.otp !== otp || Date.now() > storedOtpData.otpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        delete otpStore[key];

        res.status(200).json({ message: "OTP verified successfully", role: "user", token: "fake-jwt-token" });
    } catch (error) {
        console.error("Error in verify-otp:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {sendOtp , verifyOtp};
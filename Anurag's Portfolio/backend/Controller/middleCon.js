const MiddleCon = async (req,res) => {
    res.json({  message: "User verified successfully!",
        uid: req.user.uid,
        email: req.user.email,
        provider: req.user.firebase.sign_in_provider,
    });
}

module.exports = {MiddleCon}
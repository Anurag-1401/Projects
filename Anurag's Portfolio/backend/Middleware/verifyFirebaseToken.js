const admin = require('firebase-admin');

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyFirebaseToken;

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSU2GpEoR3nX-PIS0S4XuRxsExjCMolM4",
  authDomain: "hostel-management-29452.firebaseapp.com",
  projectId: "hostel-management-29452",
  storageBucket: "hostel-management-29452.firebasestorage.app",
  messagingSenderId: "597644344665",
  appId: "1:597644344665:web:1c04425aedc9b5601f2048",
  measurementId: "G-GTKW8P9MPQ"
};


const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, analytics };
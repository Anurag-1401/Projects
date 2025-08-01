import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAgI6irpatK88oEmlLWWG6OwV7JAy7RL34",
  authDomain: "andy-port.firebaseapp.com",
  projectId: "andy-port",
  storageBucket: "andy-port.firebasestorage.app",
  messagingSenderId: "493575338687",
  appId: "1:493575338687:web:be11fac8fac3f7ce2f640a",
  measurementId: "G-4TMN4163MM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth,analytics, googleProvider, githubProvider };

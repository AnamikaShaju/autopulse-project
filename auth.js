// Import Firebase directly from Google's CDN for Vanilla JS projects
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Your exact Firebase configuration from the console
const firebaseConfig = {
    apiKey: "AIzaSyAxEq_LQg6g2H5UlJgzNYpdOzMM3L2LjxQ",
    authDomain: "autopulse-8deed.firebaseapp.com",
    projectId: "autopulse-8deed",
    storageBucket: "autopulse-8deed.firebasestorage.app",
    messagingSenderId: "99940181400",
    appId: "1:99940181400:web:5703370439c3a8818f77ed",
    measurementId: "G-C18DEYYC3K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Grab the UI elements from our login.html page
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const mainBtn = document.getElementById('login-btn');
const googleBtn = document.getElementById('google-login-btn');
const authSwitchDiv = document.querySelector('.auth-switch');
const title = document.querySelector('h2');
const subtitle = document.querySelector('.login-card p');

let isLoginMode = true;

// 1. Toggle between "Sign In" and "Create Account"
authSwitchDiv.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            title.textContent = "Welcome Back";
            subtitle.textContent = "Sign in to access your digital glovebox.";
            mainBtn.textContent = "Sign In";
            authSwitchDiv.innerHTML = `Don't have an account? <span>Create one</span>`;
        } else {
            title.textContent = "Create Account";
            subtitle.textContent = "Join AutoPulse to secure your vehicle data.";
            mainBtn.textContent = "Sign Up";
            authSwitchDiv.innerHTML = `Already have an account? <span>Sign in</span>`;
        }
    }
});

// 2. Handle Email/Password Authentication
mainBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        mainBtn.textContent = "Processing...";
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        
        // Save login state to browser memory
        localStorage.setItem('autopulse_user', 'true');
        window.location.href = "dashboard.html"; 
    } catch (error) {
        console.error("Auth Error:", error);
        alert(error.message);
        mainBtn.textContent = isLoginMode ? "Sign In" : "Sign Up";
    }
});

// 3. Handle Google Authentication
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            googleBtn.textContent = "Connecting...";
            await signInWithPopup(auth, googleProvider);
            
            // Save login state to browser memory
            localStorage.setItem('autopulse_user', 'true');
            window.location.href = "dashboard.html"; 
        } catch (error) {
            console.error("Google Auth Error:", error);
            // THIS IS THE FIX: Shows the real Firebase error so we can debug Vercel
            alert("Firebase Error: " + error.message);
            googleBtn.textContent = "Sign In with Google";
        }
    });
}
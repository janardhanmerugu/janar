// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCmaZ_ojXb5Xkg9b5pu4ng0WaNzw42BEwc",
  authDomain: "dhanda-c6f81.firebaseapp.com",
  databaseURL: "https://dhanda-c6f81-default-rtdb.firebaseio.com",
  projectId: "dhanda-c6f81",
  storageBucket: "dhanda-c6f81.firebasestorage.app",
  messagingSenderId: "1078087902179",
  appId: "1:1078087902179:web:7291c62f89528e732176d6",
  measurementId: "G-QG764Y58JM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");
const loader = document.getElementById("loader");
const dataContainer = document.getElementById("data");

// 🟢 Google Sign-in
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(result => {
      console.log("Signed in as:", result.user.displayName);
    })
    .catch(error => {
      alert("Sign-in failed: " + error.message);
    });
});

// 🔴 Sign-out
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    console.log("Signed out");
  });
});

// 👀 Auth state listener
onAuthStateChanged(auth, user => {
  if (user) {
    // Logged in
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    userInfo.textContent = `Logged in as: ${user.displayName}`;
    loadUserData(); // Load Firebase data
  } else {
    // Logged out
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userInfo.textContent = "";
    loader.textContent = "Please sign in to view data...";
    dataContainer.innerHTML = "";
  }
});

// 🧠 Load /users data from Firebase Realtime Database
function loadUserData() {
  loader.textContent = "Loading users...";

  const usersRef = ref(db, "users");
  onValue(usersRef, snapshot => {
    const users = snapshot.val();

    if (!users) {
      loader.textContent = "No user data found.";
      return;
    }

    loader.style.display = "none";

    let html = `
      <table>
        <thead>
          <tr><th>User ID</th><th>Name</th><th>Balance</th></tr>
        </thead>
        <tbody>
    `;

    Object.entries(users).forEach(([id, user]) => {
      html += `
        <tr>
          <td>${id}</td>
          <td>${user.name || "-"}</td>
          <td>${user.balance !== undefined ? user.balance : "-"}</td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    dataContainer.innerHTML = html;
  }, error => {
    loader.textContent = "❌ Error loading data: " + error.message;
  });
}

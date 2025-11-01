// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Firebase configuration
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
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const dataSection = document.getElementById("data-section");
const userListDiv = document.getElementById("userList");
const userDetailsDiv = document.getElementById("userDetails");

// 🔹 Sign In with Google
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(err => {
    alert("Login failed: " + err.message);
  });
});

// 🔹 Sign Out
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// 🔹 Track login state
onAuthStateChanged(auth, user => {
  if (user) {
    userInfo.textContent = `Signed in as ${user.displayName}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    dataSection.style.display = "block";
    loadUsers(); // Load users only after login
  } else {
    userInfo.textContent = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    dataSection.style.display = "none";
  }
});

// 🔹 Load all users
async function loadUsers() {
  userListDiv.innerHTML = "Loading...";
  userDetailsDiv.innerHTML = "";

  try {
    const snapshot = await get(ref(db, "users"));
    const users = snapshot.val();

    if (!users) {
      userListDiv.innerHTML = "<p>No users found.</p>";
      return;
    }

    userListDiv.innerHTML = "";
    Object.keys(users).forEach(uid => {
      const btn = document.createElement("button");
      btn.className = "user-btn";
      btn.textContent = uid;
      btn.addEventListener("click", () => loadUserDetails(uid));
      userListDiv.appendChild(btn);
    });
  } catch (error) {
    userListDiv.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}

// 🔹 Load one user's details
async function loadUserDetails(uid) {
  try {
    const snapshot = await get(ref(db, `users/${uid}`));
    const data = snapshot.val();

    if (!data) {
      userDetailsDiv.innerHTML = `<p>No data found for ${uid}</p>`;
      return;
    }

    userDetailsDiv.innerHTML = `
      <h3>Details for ${uid}</h3>
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Name</td><td>${data.name || "-"}</td></tr>
        <tr><td>Balance</td><td>${data.balance || "-"}</td></tr>
      </table>
    `;
  } catch (error) {
    userDetailsDiv.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}

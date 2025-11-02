// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
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

// DOM Elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const dataSection = document.getElementById("data-section");
const tableContainer = document.getElementById("table-container");
const userDetailsDiv = document.getElementById("userDetails");

// Login with Google
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(err => alert("Login failed: " + err.message));
});

// Logout
logoutBtn.addEventListener("click", () => signOut(auth));

// Track auth state
onAuthStateChanged(auth, user => {
  if (user) {
    userInfo.textContent = `Signed in as ${user.displayName}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    dataSection.style.display = "flex";
    loadUsers();
  } else {
    userInfo.textContent = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    dataSection.style.display = "none";
  }
});

// Load all users
async function loadUsers() {
  tableContainer.innerHTML = "Loading...";
  userDetailsDiv.innerHTML = "";

  try {
    const snapshot = await get(ref(db, "users"));
    const users = snapshot.val();
    if (!users) return tableContainer.innerHTML = "<p>No users found.</p>";

    let html = `<table>
                  <thead>
                    <tr><th>User ID</th><th>Username</th></tr>
                  </thead>
                  <tbody>`;

    Object.entries(users).forEach(([userId, userData]) => {
      const profile = userData.profile ? Object.values(userData.profile)[0] : null;
      const username = profile?.username || "(No username)";

      html += `<tr data-user="${userId}" data-username="${username}">
                 <td>${userId}</td><td>${username}</td>
               </tr>`;
    });

    html += "</tbody></table>";
    tableContainer.innerHTML = html;

    // Add click listeners
    document.querySelectorAll("tbody tr[data-user]").forEach(row => {
      row.addEventListener("click", () => {
        const userId = row.dataset.user;
        const username = row.dataset.username;
        loadUserDetails(userId, username);
      });
    });

  } catch (error) {
    console.error("Firebase error:", error);
    tableContainer.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}

// Load clicked user details
async function loadUserDetails(userId, username) {
  userDetailsDiv.innerHTML = "Loading...";

  try {
    const snapshot = await get(ref(db, `users/${userId}/lot`));
    const user = snapshot.val();
    if (!user) return userDetailsDiv.innerHTML = `<p>No data found for ${username}</p>`;

    let html = `<h3>Details for ${username}</h3>`;

    Object.entries(user).forEach(([section, content]) => {
     
      if (typeof content === "object") {
        Object.entries(content).forEach(([key, value]) => {
          }
          html += `<tr><td><strong>${key}</strong></td><td>${typeof value === "object" ? JSON.stringify(value, null, 2) : value}</td></tr>`;
        });
      } else {
        html += `<tr><td colspan="2">${content}</td></tr>`;
      }
      html += `</table>`;
    });

    userDetailsDiv.innerHTML = html;

  } catch (error) {
    console.error("Firebase error:", error);
    userDetailsDiv.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}





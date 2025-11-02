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

// Load clicked user details in card layout (HORIZONTAL)
async function loadUserDetails(userId, username) {
  userDetailsDiv.innerHTML = "Loading...";

  try {
    const snapshot = await get(ref(db, `users/${userId}/lot`));
    const user = snapshot.val();
    if (!user) return userDetailsDiv.innerHTML = `<p>No data found for ${username}</p>`;

    let html = `
      <style>
        .recycler-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }
        .card-item {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }
        .card-item:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .card-content {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .card-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 150px;
          flex: 1;
        }
        .card-label {
          font-weight: 600;
          color: #555;
          text-transform: capitalize;
          font-size: 14px;
        }
        .card-value {
          color: #333;
          word-break: break-word;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 14px;
        }
        .status-true {
          color: #28a745;
          font-weight: bold;
        }
        .status-false {
          color: #dc3545;
          font-weight: bold;
        }
      </style>
      <h3>Details for ${username}</h3>
      <div class="recycler-container">
    `;

    Object.entries(user).forEach(([itemId, content]) => {
      html += `<div class="card-item">`;
      html += `<div class="card-content">`;
      
      if (typeof content === "object" && content !== null) {
        Object.entries(content).forEach(([key, value]) => {
          let displayValue = value;
          let valueClass = '';
          
          // Handle boolean status
          if (key === 'status') {
            displayValue = value ? 'Active' : 'Inactive';
            valueClass = value ? 'status-true' : 'status-false';
          } else if (key === 'sync') {
            displayValue = value ? 'Synced' : 'Not Synced';
            valueClass = value ? 'status-true' : 'status-false';
          } else if (typeof value === "object") {
            displayValue = JSON.stringify(value, null, 2);
          }
          
          html += `
            <div class="card-field">
              <span class="card-label">${key}</span>
              <span class="card-value ${valueClass}">${displayValue}</span>
            </div>
          `;
        });
      } else {
        html += `<div class="card-field"><span class="card-value">${content}</span></div>`;
      }
      
      html += `</div>`; // Close card-content
      html += `</div>`; // Close card-item
    });

    html += `</div>`;
    userDetailsDiv.innerHTML = html;

  } catch (error) {
    console.error("Firebase error:", error);
    userDetailsDiv.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}

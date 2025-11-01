// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
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
const tableContainer = document.getElementById("table-container");
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

// 🔹 Load all users in a table
async function loadUsers() {
  tableContainer.innerHTML = "Loading...";
  userDetailsDiv.innerHTML = "";

  try {
    const snapshot = await get(ref(db, "users"));
    const users = snapshot.val();

    if (!users) {
      tableContainer.innerHTML = "<p>No users found.</p>";
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
    `;

    Object.entries(users).forEach(([id, user]) => {
      html += `
        <tr data-user="${id}">
          <td>${id}</td>
          <td>${user.name || "-"}</td>
          <td>${user.balance || "-"}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    tableContainer.innerHTML = html;

    // Add click listener for each row
    document.querySelectorAll("tr[data-user]").forEach(row => {
      row.addEventListener("click", () => {
        const userId = row.getAttribute("data-user");
        loadUserDetails(userId);
      });
    });
  } catch (error) {
    tableContainer.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}

// 🔹 Load clicked user details
async function loadUserDetails(uid) {
  try {
    const snapshot = await get(ref(db, `users/${uid}`));
    const data = snapshot.val();

    if (!data) {
      userDetailsDiv.innerHTML = `<p>No data found for ${uid}</p>`;
      return;
    }

    let detailsHtml = `<h3>Details for ${uid}</h3><table>`;
    Object.entries(data).forEach(([key, value]) => {
      detailsHtml += `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
    });
    detailsHtml += `</table>`;

    userDetailsDiv.innerHTML = detailsHtml;
  } catch (error) {
    userDetailsDiv.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}

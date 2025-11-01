// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ✅ Firebase Configuration
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

// HTML elements
const loader = document.getElementById("loader");
const dataContainer = document.getElementById("data");

// Realtime listener for /users
const usersRef = ref(db, "users");

// 🔄 Listen for live data updates
onValue(usersRef, (snapshot) => {
  const users = snapshot.val();

  if (!users) {
    loader.textContent = "No user data found.";
    return;
  }

  loader.style.display = "none";

  // Build dynamic table
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
      <tr>
        <td>${id}</td>
        <td>${user.name || "-"}</td>
        <td>${user.balance !== undefined ? user.balance : "-"}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  dataContainer.innerHTML = html;
}, (error) => {
  loader.textContent = "❌ Error loading data: " + error.message;
});

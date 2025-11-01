// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ✅ Your Firebase configuration
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

// Reference your data path (adjust as needed)
const dataRef = ref(db, "users");

// Import 'get' instead of 'onValue'
import { get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Fetch data once
get(dataRef)
  .then((snapshot) => {
    const users = snapshot.val();
    const container = document.getElementById("data");

    if (!users) {
      container.innerHTML = "<p>No data found at /users</p>";
      return;
    }

    // Build an HTML table dynamically
    let html = "<table><tr><th>ID</th><th>Name</th><th>Balance</th></tr>";

    Object.entries(users).forEach(([id, user]) => {
      html += `
        <tr>
          <td>${id}</td>
          <td>${user.name || "-"}</td>
          <td>${user.balance || "-"}</td>
        </tr>
      `;
    });

    html += "</table>";
    container.innerHTML = html;
  })
  .catch((error) => {
    document.getElementById("data").innerHTML =
      "<p style='color:red;'>Error: " + error.message + "</p>";
  });

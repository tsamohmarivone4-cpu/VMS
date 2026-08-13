//  DUMMY DATA - Replace this with data from your backend later
let appointments = [
  { id: 1, visitor: "John Doe", purpose: "Meeting", date: "2026-08-11", status: "Pending" },
  { id: 2, visitor: "Jane Smith", purpose: "Interview", date: "2026-08-11", status: "Approved" },
  { id: 3, visitor: "Mark Buea", purpose: "Delivery", date: "2026-08-12", status: "Pending" }
];

// Save to localStorage so it persists after refresh
if(!localStorage.getItem('appointments')){
  localStorage.setItem('appointments', JSON.stringify(appointments));
}

let currentFilter = "All";

// load appointment
function loadAppointments(filter = "All"){
  currentFilter = filter;
  const tableBody = document.getElementById('appointmentsTable');
  const data = JSON.parse(localStorage.getItem('appointments'));
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  let filtered = data;
  if(filter === "Pending"){
    filtered = data.filter(a => a.status === "Pending");
  }
  if(filter === "Today"){
    filtered = data.filter(a => a.date === today);
  }

  tableBody.innerHTML = ""; // clear table

  if(filtered.length === 0){
    tableBody.innerHTML = `<tr><td colspan="4">No appointments found</td></tr>`;
    return;
  }

  filtered.forEach(app => {
    const row = `
      <tr>
        <td>${app.visitor}</td>
        <td>${app.purpose}</td>
        <td><span class="status ${app.status.toLowerCase()}">${app.status}</span></td>
        <td>
          ${app.status === "Pending"? 
            `<button onclick="updateStatus(${app.id}, 'Approved')">Approve</button>
             <button onclick="updateStatus(${app.id}, 'Rejected')">Reject</button>` 
            : "-" }
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  // highlight active tab
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.getElementById('tab' + filter).classList.add('active');
}

// 3. APPROVE / REJECT FUNCTION
function updateStatus(id, newStatus){
  let data = JSON.parse(localStorage.getItem('appointments'));
  data = data.map(app => {
    if(app.id === id){
      app.status = newStatus;
    }
    return app;
  });
  localStorage.setItem('appointments', JSON.stringify(data));
  alert(`Appointment ${newStatus}`);
  loadAppointments(currentFilter); // reload table
}

// 4. TAB CLICK EVENTS
document.getElementById('tabAll').addEventListener('click', () => loadAppointments("All"));
document.getElementById('tabPending').addEventListener('click', () => loadAppointments("Pending"));
document.getElementById('tabToday').addEventListener('click', () => loadAppointments("Today"));

// 5. LOGOUT FUNCTION
function logout(){
  // later you can clear session here
  window.location.href = "index.html"; // go back to login
}

// 6. RUN ON PAGE LOAD
window.onload = () => loadAppointments("All");

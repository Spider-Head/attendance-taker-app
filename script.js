let classrooms = JSON.parse(localStorage.getItem("classrooms") || "{}");
let currentClass = "";

function saveClassrooms() {
  localStorage.setItem("classrooms", JSON.stringify(classrooms));
}

function createClassroom() {
  const name = document.getElementById("classroomName").value.trim();
  if (!name) return alert("Enter a valid name");
  if (classrooms[name]) return alert("Classroom already exists");

  classrooms[name] = { students: [], attendance: {} };
  saveClassrooms();
  loadClassroomList();
  document.getElementById("classroomName").value = "";
}

function loadClassroomList() {
  const select = document.getElementById("classroomSelect");
  select.innerHTML = '<option value="">-- Select Classroom --</option>';
  for (let cls in classrooms) {
    select.innerHTML += `<option value="${cls}">${cls}</option>`;
  }
}

function loadClassroom() {
  currentClass = document.getElementById("classroomSelect").value;
  if (!currentClass) return (document.getElementById("classSection").style.display = "none");
  document.getElementById("classSection").style.display = "block";
  loadStudentTable();
}

function addStudent() {
  const name = document.getElementById("studentName").value.trim();
  if (!name) return;
  classrooms[currentClass].students.push(name);
  saveClassrooms();
  document.getElementById("studentName").value = "";
  loadStudentTable();
}

function markAllPresent() {
  const date = document.getElementById("attendanceDate").value;
  if (!date) return alert("Select date");
  if (!classrooms[currentClass].attendance[date]) {
    classrooms[currentClass].attendance[date] = {};
  }
  classrooms[currentClass].students.forEach(name => {
    classrooms[currentClass].attendance[date][name] = "Present";
  });
  saveClassrooms();
  loadStudentTable();
}

function toggleStatus(name) {
  const date = document.getElementById("attendanceDate").value;
  if (!date) return alert("Select date");
  const status = classrooms[currentClass].attendance[date][name];
  classrooms[currentClass].attendance[date][name] = status === "Absent" ? "Present" : "Absent";
  saveClassrooms();
  loadStudentTable();
}

function loadStudentTable() {
  const date = document.getElementById("attendanceDate").value;
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";

  const students = classrooms[currentClass].students;
  const attendance = classrooms[currentClass].attendance[date] || {};

  students.forEach(name => {
    if (!attendance[name]) attendance[name] = "Absent";
    const row = `<tr>
      <td>${name}</td>
      <td>${attendance[name]}</td>
      <td><button onclick="toggleStatus('${name}')">Toggle</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });

  classrooms[currentClass].attendance[date] = attendance;
  saveClassrooms();
}

function clearClassroom() {
  if (confirm("Are you sure you want to delete this classroom?")) {
    delete classrooms[currentClass];
    saveClassrooms();
    currentClass = "";
    loadClassroomList();
    document.getElementById("classSection").style.display = "none";
  }
}

function printAttendance() {
  const date = document.getElementById("attendanceDate").value;
  if (!date) return alert("Please select a date to print");

  let printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`<h2>Attendance for ${currentClass} - ${date}</h2>`);
  printWindow.document.write('<table border="1"><tr><th>Name</th><th>Status</th></tr>');

  const attendance = classrooms[currentClass].attendance[date];
  for (let name of classrooms[currentClass].students) {
    const status = attendance?.[name] || "Absent";
    printWindow.document.write(`<tr><td>${name}</td><td>${status}</td></tr>`);
  }

  printWindow.document.write('</table>');
  printWindow.document.close();
  printWindow.print();
}

window.onload = loadClassroomList;

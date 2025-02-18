document.addEventListener("DOMContentLoaded", function () {
    loadAppointments();
});


function openModal() {
    document.getElementById("modal").style.display = "block";
}
function closeModal() {
    document.getElementById("modal").style.display = "none";
}


document.getElementById("appointmentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let service = document.getElementById("service").value;
    let datetime = document.getElementById("datetime").value;
    let terms = document.getElementById("terms").checked;
    let isValid = true;

    if (name === "") {
        document.getElementById("nameError").textContent = "Name is required.";
        isValid = false;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email.";
        isValid = false;
    } else {
        document.getElementById("emailError").textContent = "";
    }

    let phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        document.getElementById("phoneError").textContent = "Phone number must be 10 digits.";
        isValid = false;
    } else {
        document.getElementById("phoneError").textContent = "";
    }

    let selectedDate = new Date(datetime);
    let currentDate = new Date();
    if (selectedDate <= currentDate) {
        document.getElementById("dateError").textContent = "Select a future date and time.";
        isValid = false;
    } else {
        document.getElementById("dateError").textContent = "";
    }


    if (!terms) {
        document.getElementById("termsError").textContent = "You must agree to the terms.";
        isValid = false;
    } else {
        document.getElementById("termsError").textContent = "";
    }

    if (!isValid) {
        return;
    }

    let appointment = {
        name,
        email,
        phone,
        service,
        datetime,
        status: "Pending"
    };

    saveAppointment(appointment);
    showConfirmation(name, service, datetime);
    closeModal();
});


function saveAppointment(appointment) {
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments.push(appointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    loadAppointments();
}


function loadAppointments() {
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    let appointmentList = document.getElementById("appointmentList");

    if (!appointmentList) {
        appointmentList = document.createElement("div");
        appointmentList.id = "appointmentList";
        document.body.appendChild(appointmentList);
    }

    appointmentList.innerHTML = "<h2>Booked Appointments</h2>";
    
    if (appointments.length === 0) {
        appointmentList.innerHTML += "<p>No appointments booked yet.</p>";
        return;
    }

    let table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Service</th>
            <th>Date & Time</th>
            <th>Status</th>
        </tr>
    `;

    appointments.forEach(app => {
        let row = table.insertRow();
        row.innerHTML = `
            <td>${app.name}</td>
            <td>${app.service}</td>
            <td>${app.datetime}</td>
            <td>${app.status}</td>
        `;
    });
    appointmentList.appendChild(table);
}

function showConfirmation(name, service, datetime) {
    let confirmationBox = document.createElement("div");
    confirmationBox.classList.add("confirmation-box");
    confirmationBox.innerHTML = `
        <p>Thank you, <strong>${name}</strong>! Your appointment for <strong>${service}</strong> on <strong>${datetime}</strong> is confirmed.</p>
        <button onclick="this.parentElement.remove()">Close</button>`;
    document.body.appendChild(confirmationBox);
}


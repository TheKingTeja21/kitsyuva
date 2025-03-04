// Import Firebase SDK (Add this in HTML inside <head>)
document.write(
  '<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>'
);
document.write(
  '<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"></script>'
);

// Firebase Configuration (Replace with your Firebase project credentials)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById("eventSelect").addEventListener("change", function () {
  let selectedOption = this.options[this.selectedIndex];
  let members = selectedOption.getAttribute("data-members");
  let price = selectedOption.getAttribute("data-price");

  document.getElementById("eventFee").value = `₹${price}`;

  let participantContainer = document.getElementById("participantContainer");
  participantContainer.innerHTML = "";

  for (let i = 1; i <= members; i++) {
    let div = document.createElement("div");
    div.classList.add("participant");
    div.innerHTML = `
            <label>Participant ${i} Name:</label>
            <input type="text" name="participant${i}" required placeholder="Enter name">
            
            <label>Participant ${i} Roll No:</label>
            <input type="text" name="rollno${i}" required placeholder="Enter roll number">
            
            <label>Participant ${i} Year:</label>
            <select name="year${i}" required>
                <option value="" disabled selected>Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
            </select>
            
            <label>Participant ${i} Section:</label>
            <select name="section${i}" required>
                <option value="" disabled selected>Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
            </select>
        `;
    participantContainer.appendChild(div);
  }

  generatePhonePeQR(price);
});

// Function to Generate PhonePe QR Code
function generatePhonePeQR(amount) {
  let phonePeUPI = "yourupiid@okicici"; // Replace with actual UPI ID
  let upiLink = `upi://pay?pa=${phonePeUPI}&pn=Event+Organizer&mc=&tid=&tr=&tn=Event+Registration&am=${amount}&cu=INR`;

  let qr = new QRious({
    element: document.getElementById("qrCodeCanvas"),
    value: upiLink,
    size: 200,
  });
}

// Function to Submit Form & Store Data in Firebase Firestore
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let eventName =
      document.getElementById("eventSelect").options[
        document.getElementById("eventSelect").selectedIndex
      ].text;
    let eventFee = document.getElementById("eventFee").value;
    let transactionId = document.getElementById("transactionId").value;
    let participants = [];

    document
      .querySelectorAll("#participantContainer .participant")
      .forEach((participant, index) => {
        let name = participant.querySelector(
          `input[name="participant${index + 1}"]`
        ).value;
        let rollno = participant.querySelector(
          `input[name="rollno${index + 1}"]`
        ).value;
        let year = participant.querySelector(
          `select[name="year${index + 1}"]`
        ).value;
        let section = participant.querySelector(
          `select[name="section${index + 1}"]`
        ).value;

        participants.push({ name, rollno, year, section });
      });

    db.collection("event_registrations")
      .add({
        event: eventName,
        fee: eventFee,
        transactionId: transactionId,
        participants: participants,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert("Registration successful!");
        document.getElementById("registrationForm").reset();
        document.getElementById("participantContainer").innerHTML = "";
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  });

// API URL
const API_BASE_URL = "http://localhost:5000";

// DOM Elements
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");
const registrationsContainer = document.getElementById(
  "registrations-container"
);
const eventSearchInput = document.getElementById("eventSearch");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const modal = document.getElementById("registrationModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const closeButton = document.querySelector(".close-button");

// State
let allRegistrations = [];

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Load all registrations on page load
  fetchAllRegistrations();

  // Set up event listeners
  searchBtn.addEventListener("click", handleSearch);
  resetBtn.addEventListener("click", resetSearch);
  eventSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Modal close button
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

// Fetch all registrations from the server
async function fetchAllRegistrations() {
  showLoading(true);
  hideError();

  try {
    const response = await fetch(`${API_BASE_URL}/get-registrations`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      allRegistrations = data.registrations;
      displayRegistrations(allRegistrations);
    } else {
      showError(data.error || "Failed to load registrations");
    }
  } catch (error) {
    showError(
      "Could not connect to the server. Please check if the server is running."
    );
    console.error("Error fetching registrations:", error);
  } finally {
    showLoading(false);
  }
}

// Fetch registrations by event name
async function fetchRegistrationsByEvent(eventName) {
  showLoading(true);
  hideError();

  try {
    const response = await fetch(
      `${API_BASE_URL}/get-registrations-by-event?event_name=${encodeURIComponent(
        eventName
      )}`
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      displayRegistrations(data.registrations);
    } else {
      showError(data.error || "Failed to search registrations");
    }
  } catch (error) {
    showError("Search failed. Could not connect to the server.");
    console.error("Error searching registrations:", error);
  } finally {
    showLoading(false);
  }
}

// Fetch a single registration by ID
async function fetchRegistrationById(registrationId) {
  showLoading(true);
  hideError();

  try {
    const response = await fetch(
      `${API_BASE_URL}/get-registration/${registrationId}`
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      displayRegistrationDetails(data.registration);
    } else {
      showError(data.error || "Failed to load registration details");
    }
  } catch (error) {
    showError("Could not load registration details.");
    console.error("Error fetching registration details:", error);
  } finally {
    showLoading(false);
  }
}

// Display all registrations in the container
function displayRegistrations(registrations) {
  registrationsContainer.innerHTML = "";

  if (registrations.length === 0) {
    registrationsContainer.innerHTML =
      '<div class="no-registrations">No registrations found</div>';
    return;
  }

  registrations.forEach((registration) => {
    const card = document.createElement("div");
    card.className = "registration-card";
    card.dataset.id = registration.id;

    const participants = JSON.parse(registration.participants);

    card.innerHTML = `
            <h3>${registration.event_name}</h3>
            <div class="registration-info">
                <p><strong>Price:</strong> $${registration.price}</p>
                <p><strong>Transaction ID:</strong> ${registration.transaction_id.substring(
                  0,
                  10
                )}...</p>
                <div class="participant-count">${
                  participants.length
                } Participant${participants.length !== 1 ? "s" : ""}</div>
            </div>
        `;

    card.addEventListener("click", () => {
      fetchRegistrationById(registration.id);
    });

    registrationsContainer.appendChild(card);
  });
}

// Display detailed registration information in modal
function displayRegistrationDetails(registration) {
  modalTitle.textContent = `${registration.event_name} Registration`;

  const participants = JSON.parse(registration.participants);

  let participantsHTML = `
        <table class="participants-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Year</th>
                    <th>Section</th>
                </tr>
            </thead>
            <tbody>
    `;

  participants.forEach((participant) => {
    participantsHTML += `
            <tr>
                <td>${participant.name}</td>
                <td>${participant.rollno}</td>
                <td>${participant.year}</td>
                <td>${participant.section}</td>
            </tr>
        `;
  });

  participantsHTML += `
            </tbody>
        </table>
    `;

  let paymentProofHTML = "";
  if (registration.image_url) {
    paymentProofHTML = `
            <div class="payment-proof">
                <h3>Payment Proof</h3>
                <img src="${registration.image_url}" alt="Payment proof" />
            </div>
        `;
  }

  modalContent.innerHTML = `
        <div class="registration-details">
            <p><strong>Transaction ID:</strong> ${registration.transaction_id}</p>
            <p><strong>Price:</strong> $${registration.price}</p>
            
            <h3>Participants</h3>
            ${participantsHTML}
            
            ${paymentProofHTML}
        </div>
    `;

  modal.style.display = "block";
}

// Handle search button click
function handleSearch() {
  const searchTerm = eventSearchInput.value.trim();

  if (searchTerm === "") {
    showError("Please enter an event name to search");
    return;
  }

  fetchRegistrationsByEvent(searchTerm);
}

// Reset search and show all registrations
function resetSearch() {
  eventSearchInput.value = "";
  displayRegistrations(allRegistrations);
}

// Show/hide loading indicator
function showLoading(show) {
  loadingElement.style.display = show ? "block" : "none";
}

// Show error message
function showError(message) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

// Hide error message
function hideError() {
  errorElement.style.display = "none";
}

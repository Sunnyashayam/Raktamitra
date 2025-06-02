// Firebase config - replace with your own config
const firebaseConfig = {
  apiKey: "AIzaSyDZ4e3ewMyVkUJFbLZyRb1SH37cakFwMiQ",
  authDomain: "raktamitra-4c4ee.firebaseapp.com",
  projectId: "raktamitra-4c4ee",
  storageBucket: "raktamitra4c4ee.firebasestorage.app",
  messagingSenderId: "997339508669",
  appId: "1:997339508669:web:399ae9f6b7bf8e4e83acd4",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Auto-detect city in English
function detectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
        );
        const data = await response.json();
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          "";
        document.getElementById("location").value = city;
      },
      (error) => {
        console.warn("Geolocation error or permission denied", error);
        document.getElementById("location").placeholder =
          "Please enter location manually";
      }
    );
  } else {
    document.getElementById("location").placeholder =
      "Geolocation not supported, enter manually";
  }
}

detectLocation();

function validateMobile() {
  const mobileInput = document.getElementById("mobile");
  const errorMsg = document.getElementById("mobileError");
  const valid = /^\d{10}$/.test(mobileInput.value);
  if (!valid) {
    errorMsg.style.display = "block";
    return false;
  } else {
    errorMsg.style.display = "none";
    return true;
  }
}

document.getElementById("mobile").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
});

document.getElementById("requestForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!validateMobile()) {
    return;
  }

  const patientName = this.patientName.value.trim();
  const bloodGroup = this.bloodGroup.value;
  const hospitalName = this.hospitalName.value.trim();
  const mobile = "+91" + this.mobile.value;
  const location = this.location.value.trim();
  const urgent = this.urgent.checked;

  // TODO: Save request to Firestore if needed

  // Query donors collection where bloodGroup matches and city matches (case insensitive)
  const donorListDiv = document.getElementById("donorList");
  donorListDiv.innerHTML = "<p>Searching donors...</p>";

  try {
    const donorsSnapshot = await db.collection("donors")
      .where("bloodGroup", "==", bloodGroup)
      .where("city", "==", location)
      .get();

    if (donorsSnapshot.empty) {
      donorListDiv.innerHTML = "<p>No donors found in your area for this blood group.</p>";
      return;
    }

    donorListDiv.innerHTML = `<h3>Available Donors (${donorsSnapshot.size})</h3>`;

    donorsSnapshot.forEach(doc => {
      const donor = doc.data();
      const donorDiv = document.createElement("div");
      donorDiv.className = "donor-item";
      donorDiv.innerHTML = `
        <strong>${donor.name}</strong>
        <div class="donor-info">DOB: ${donor.dob} | Last Blood Donated: ${donor.lastBloodDonated}</div>
      `;

      donorDiv.addEventListener("click", () => {
        // Open chat.html passing donorId and patientName (or requester)
        const url = `chat.html?donorId=${doc.id}&patientName=${encodeURIComponent(patientName)}`;
        window.location.href = url;
      });

      donorListDiv.appendChild(donorDiv);
    });

  } catch (error) {
    donorListDiv.innerHTML = `<p style="color:red;">Error fetching donors: ${error.message}</p>`;
  }
});

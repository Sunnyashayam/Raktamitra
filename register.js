// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZ4e3ewMyVkUJFbLZyRb1SH37cakFwMiQ",
  authDomain: "raktamitra-4c4ee.firebaseapp.com",
  projectId: "raktamitra-4c4ee",
  storageBucket: "raktamitra-4c4ee.firebasestorage.app",
  messagingSenderId: "997339508669",
  appId: "1:997339508669:web:399ae9f6b7bf8e4e83acd4",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Set max date for DOB and lastDonated
const today = new Date().toISOString().split("T")[0];
document.getElementById("dob").max = today;
document.getElementById("lastDonated").max = today;

// Show/hide other blood group field
const bloodGroupSelect = document.getElementById("bloodGroup");
const otherBloodGroupDiv = document.getElementById("otherBloodGroupDiv");

bloodGroupSelect.addEventListener("change", () => {
  if (bloodGroupSelect.value === "Other") {
    otherBloodGroupDiv.style.display = "block";
    document.getElementById("otherBloodGroup").setAttribute("required", "required");
  } else {
    otherBloodGroupDiv.style.display = "none";
    document.getElementById("otherBloodGroup").removeAttribute("required");
    document.getElementById("otherBloodGroup").value = "";
  }
});

// Show/hide membership ID
const volunteerYes = document.getElementById("volunteerYes");
const volunteerNo = document.getElementById("volunteerNo");
const membershipDiv = document.getElementById("membershipIdDiv");
const membershipInput = document.getElementById("membershipId");

function toggleMembership() {
  if (volunteerYes.checked) {
    membershipDiv.style.display = "block";
    membershipInput.setAttribute("required", "required");
  } else {
    membershipDiv.style.display = "none";
    membershipInput.removeAttribute("required");
    membershipInput.value = "";
  }
}

volunteerYes.addEventListener("change", toggleMembership);
volunteerNo.addEventListener("change", toggleMembership);

// Only digits for mobile and membership ID
document.getElementById("mobile").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
});

membershipInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "");
});

// Form submission
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.name.value.trim();
  const mobile = e.target.mobile.value.trim();
  let bloodGroup = e.target.bloodGroup.value;
  const otherBloodGroup = e.target.otherBloodGroup.value.trim();
  const city = e.target.city.value.trim();
  const dob = e.target.dob.value;
  const lastDonated = e.target.lastDonated.value;
  const volunteer = e.target.volunteer.value;
  const membershipNum = e.target.membershipId.value.trim();

  if (bloodGroup === "Other") {
    if (!otherBloodGroup) {
      alert("Please specify your blood group.");
      return;
    }
    bloodGroup = otherBloodGroup.toUpperCase();
  }

  if (mobile.length !== 10) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  let membershipIdFinal = null;
  if (volunteer === "yes") {
    if (!membershipNum) {
      alert("Please enter your membership number.");
      return;
    }
    membershipIdFinal = "ASYM" + membershipNum;
  }

  try {
    await db.collection("donors").add({
      name,
      mobile: "+91" + mobile,
      bloodGroup,
      city,
      dob,
      lastDonated: lastDonated || null,
      volunteer,
      membershipId: membershipIdFinal,
      approved: false,
      timestamp: new Date().toISOString(),
    });

    alert("Registration successful! Thank you for registering as a donor.");
    e.target.reset();
    otherBloodGroupDiv.style.display = "none";
    membershipDiv.style.display = "none";
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Oops! Something went wrong. Please try again later.");
  }
});

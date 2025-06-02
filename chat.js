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

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const donorId = getQueryParam("donorId");
const patientName = getQueryParam("patientName") || "Requester";

if (!donorId) {
  alert("Invalid chat request. Donor ID missing.");
  window.location.href = "request.html";
}

async function loadDonorInfo() {
  try {
    const donorDoc = await db.collection("donors").doc(donorId).get();
    if (!donorDoc.exists) {
      alert("Donor not found.");
      window.location.href = "request.html";
    }
    const donor = donorDoc.data();
    document.getElementById("donorName").textContent = donor.name;
    document.getElementById("donorDOB").textContent = donor.dob;
    document.getElementById("donorLastDonated").textContent = donor.lastBloodDonated;
  } catch (error) {
    alert("Error loading donor info: " + error.message);
    window.location.href = "request.html";
  }
}

const chatMessagesDiv = document.getElementById("chatMessages");
const typingIndicatorDiv = document.getElementById("typingIndicator");

let chatId = donorId < patientName ? donorId + "_" + patientName : patientName + "_" + donorId;

function formatTimestamp(ts) {
  if (!ts) return "";
  let date;
  if (ts.toDate) {
    date = ts.toDate();
  } else if (ts instanceof Date) {
    date = ts;
  } else {
    date = new Date(ts);
  }
  return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
}

const typingRef = db.collection("typingStatus").doc(chatId);

let typingTimeout;
const messageInput = document.getElementById("messageInput");

messageInput.addEventListener("input", () => {
  typingRef.set({ [patientName]: true }, { merge: true });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typingRef.set({ [patientName]: false }, { merge: true });
  }, 1500);
});

window.addEventListener("beforeunload", () => {
  typingRef.set({ [patientName]: false }, { merge: true });
});

typingRef.onSnapshot(doc => {
  if (!doc.exists) {
    typingIndicatorDiv.textContent = "";
    return;
  }
  const data = doc.data();
  if (data && data[donorId]) {
    typingIndicatorDiv.textContent = "Donor is typing...";
  } else {
    typingIndicatorDiv.textContent = "";
  }
});

function loadMessages() {
  db.collection("chats")
    .doc(chatId)
    .collection("messages")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      chatMessagesDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const msg = doc.data();
        const msgDiv = document.createElement("div");
        msgDiv.className = "message " + (msg.sender === patientName ? "sent" : "received");

        const textNode = document.createTextNode(msg.text);
        msgDiv.appendChild(textNode);

        const tsSpan = document.createElement("span");
        tsSpan.className = "timestamp";
        tsSpan.textContent = formatTimestamp(msg.timestamp);
        msgDiv.appendChild(tsSpan);

        if (msg.sender === patientName) {
          const statusSpan = document.createElement("span");
          statusSpan.className = "status";
          statusSpan.textContent = "Sent";
          msgDiv.appendChild(statusSpan);
        }

        chatMessagesDiv.appendChild(msgDiv);
      });
      chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    });
}

document.getElementById("messageForm").addEventListener("submit", async e => {
  e.preventDefault();
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  const now = firebase.firestore.Timestamp.now();

  try {
    const msgRef = db.collection("chats").doc(chatId).collection("messages");

    await msgRef.add({
      sender: patientName,
      text: text,
      timestamp: now
    });

    await db.collection("donorChats").doc(donorId).collection("chats").doc(chatId).set({
      patientName: patientName,
      lastMessageAt: now
    });

    await db.collection("patientChats").doc(patientName).collection("chats").doc(chatId).set({
      donorId: donorId,
      lastMessageAt: now
    });

    await db.collection("notifications").doc(donorId).set({
      message: `New message from ${patientName}`,
      chatId: chatId,
      timestamp: now
    });

    await db.collection("notifications").doc(patientName).set({
      message: "Message sent to donor",
      chatId: chatId,
      timestamp: now
    });

    const snapshot = await msgRef.orderBy("timestamp").get();
    if (snapshot.size === 1) {
      await msgRef.add({
        sender: "Raktamitra Bot",
        text: "🩸 Raktamitra is just a bridge between blood donors and those in need. We are not responsible if the donor doesn't respond in time.",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      await msgRef.add({
        sender: "Raktamitra Bot",
        text: "📅 Please share the **date and time** when you need the blood. This helps the donor plan accordingly.",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    input.value = "";
    typingRef.set({ [patientName]: false }, { merge: true });
  } catch (error) {
    alert("Error sending message: " + error.message);
  }
});

loadDonorInfo();
loadMessages();

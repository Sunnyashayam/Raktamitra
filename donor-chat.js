// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZ4e3ewMyVkUJFbLZyRb1SH37cakFwMiQ",
  authDomain: "raktamitra-4c4ee.firebaseapp.com",
  projectId: "raktamitra-4c4ee",
  storageBucket: "raktamitra-4c4ee.appspot.com",
  messagingSenderId: "997339508669",
  appId: "1:997339508669:web:399ae9f6b7bf8e4e83acd4"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentDonorId = null;
let currentChatId = null;
let unsubscribeMessages = null;
let unsubscribeTyping = null;

const loginSection = document.getElementById('loginSection');
const chatSection = document.getElementById('chatSection');
const chatListDiv = document.getElementById('chatList');
const chatWindow = document.getElementById('chatWindow');
const chatWithEl = document.getElementById('chatWith');
const messagesDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');

document.getElementById('loginBtn').onclick = async () => {
  const donorIdInput = document.getElementById('donorIdInput').value.trim();
  if (!donorIdInput) {
    alert("Please enter your donor ID.");
    return;
  }
  const donorDoc = await db.collection("donors").doc(donorIdInput).get();
  if (!donorDoc.exists) {
    alert("Donor ID not found. Please check and try again.");
    return;
  }
  currentDonorId = donorIdInput;
  loginSection.style.display = "none";
  chatSection.style.display = "block";
  loadChats();
};

async function loadChats() {
  chatListDiv.innerHTML = "Loading chats...";
  const donorChatsSnap = await db.collection("donorChats").doc(currentDonorId).collection("chats").get();
  if (donorChatsSnap.empty) {
    chatListDiv.innerHTML = "No chats yet.";
    return;
  }
  chatListDiv.innerHTML = "";
  donorChatsSnap.forEach(doc => {
    const chat = doc.data();
    const div = document.createElement("div");
    div.className = "chatItem";
    div.textContent = `Chat with: ${chat.patientName}`;
    div.onclick = () => openChat(doc.id, chat.patientName);
    chatListDiv.appendChild(div);
  });
}

function openChat(chatId, patientName) {
  currentChatId = chatId;
  chatWindow.style.display = "block";
  chatWithEl.textContent = `Chat with ${patientName}`;
  messagesDiv.innerHTML = "Loading messages...";
  typingIndicator.textContent = "";

  if (unsubscribeMessages) unsubscribeMessages();
  if (unsubscribeTyping) unsubscribeTyping();

  // Listen to messages
  unsubscribeMessages = db.collection("chats").doc(chatId).collection("messages")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      messagesDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const msg = doc.data();
        const isYou = msg.sender === "You";
        const div = document.createElement("div");
        div.className = "message" + (isYou ? " you" : "");
        div.innerHTML = `<div class="sender">${msg.sender}:</div><div>${msg.text}</div>`;
        messagesDiv.appendChild(div);
      });
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

  // Listen to patient's typing status
  unsubscribeTyping = db.collection("chats").doc(chatId)
    .onSnapshot(doc => {
      if (!doc.exists) return;
      const data = doc.data();
      // Show typing indicator if patientTyping is true
      if (data.patientTyping) {
        typingIndicator.textContent = "Patient is typing...";
      } else {
        typingIndicator.textContent = "";
      }
    });
}

let typingTimeout;

// When donor types, update typing flag
messageInput.addEventListener("input", () => {
  if (!currentChatId) return;
  db.collection("chats").doc(currentChatId).update({
    donorTyping: true
  }).catch(() => {}); // ignore errors

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    db.collection("chats").doc(currentChatId).update({
      donorTyping: false
    }).catch(() => {});
  }, 1500);
});

chatForm.onsubmit = async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  // Send message
  await db.collection("chats").doc(currentChatId).collection("messages").add({
    sender: "You",
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Clear typing flag immediately after sending
  await db.collection("chats").doc(currentChatId).update({
    donorTyping: false,
    newMessageFromDonorAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  messageInput.value = "";
};

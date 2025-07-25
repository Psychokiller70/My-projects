const socket = io();
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const emojiToggle = document.getElementById('emoji-toggle');
const emojiPicker = document.getElementById('emoji-picker');

let currentMessageId = null;
let currentWrapper = null;

// Load messages from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedMessages = JSON.parse(localStorage.getItem('chat-messages')) || [];
  savedMessages.forEach(msg => appendMessage(msg));
});

// Save and remove from localStorage
function saveMessage(msg) {
  const saved = JSON.parse(localStorage.getItem('chat-messages')) || [];
  saved.push(msg);
  localStorage.setItem('chat-messages', JSON.stringify(saved));
}

function removeMessage(id) {
  const saved = JSON.parse(localStorage.getItem('chat-messages')) || [];
  const updated = saved.filter(msg => msg.id !== id);
  localStorage.setItem('chat-messages', JSON.stringify(updated));
}

// Emoji picker toggle
emojiToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  emojiPicker.classList.toggle('hidden');
});

emojiPicker.addEventListener('emoji-click', (event) => {
  chatInput.value += event.detail.unicode;
  // emojiPicker.classList.add('hidden');
  chatInput.focus();
});

document.addEventListener('click', (e) => {
  if (!emojiPicker.contains(e.target) && e.target !== emojiToggle) {
    emojiPicker.classList.add('hidden');
  }
});

// Send message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const id = Date.now();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msg = { id, fromMe: true, text, time };

  appendMessage(msg);
  saveMessage(msg);

  socket.emit('chat message', msg);
  socket.emit('stop typing');

  chatInput.value = '';
  chatInput.focus();
});

// Receive message
socket.on('chat message', (msg) => {
  msg.fromMe = false;
  appendMessage(msg);
  saveMessage(msg);
});

// Append message
function appendMessage({ id, fromMe, text, time }) {
  const wrapper = document.createElement('div');
  wrapper.className = fromMe ? 'message right' : 'message left';
  wrapper.dataset.id = id;

  const bubble = document.createElement('div');
  bubble.className = fromMe ? 'bubble me' : 'bubble other';
  bubble.style.position = 'relative';

  bubble.innerHTML = `
    <p>${text}</p>
    <time>${time}</time>
  `;

  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (fromMe) {
    let pressTimer;

    function startPress(e) {
      e.preventDefault();
      pressTimer = setTimeout(() => {
        currentMessageId = id;
        currentWrapper = wrapper;
        showDeleteModal();
      }, 700);
    }

    function cancelPress() {
      clearTimeout(pressTimer);
    }

    bubble.addEventListener('mousedown', startPress);
    bubble.addEventListener('mouseup', cancelPress);
    bubble.addEventListener('mouseleave', cancelPress);

    bubble.addEventListener('touchstart', startPress, { passive: false });
    bubble.addEventListener('touchend', cancelPress);
    bubble.addEventListener('touchcancel', cancelPress);
  }
}

// Show delete modal
function showDeleteModal() {
  const modal = document.getElementById('delete-modal');
  if (modal) {
    modal.classList.add('show');
    modal.classList.remove('hidden');
  }
}

// Hide delete modal
function hideDeleteModal() {
  const modal = document.getElementById('delete-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.classList.add('hidden');
  }
}

// Modal actions
document.getElementById('cancel-delete').addEventListener('click', hideDeleteModal);

document.getElementById('delete-for-me').addEventListener('click', () => {
  if (currentWrapper) currentWrapper.remove();
  removeMessage(currentMessageId);
  hideDeleteModal();
});

document.getElementById('delete-for-everyone').addEventListener('click', () => {
  socket.emit('delete message for everyone', currentMessageId);
  hideDeleteModal();
});

// Real-time delete from others
socket.on('delete message', (id) => {
  const msgDiv = document.querySelector(`[data-id='${id}']`);
  if (msgDiv) {
    msgDiv.classList.add('fade-out');
    setTimeout(() => msgDiv.remove(), 300);
  }
  removeMessage(id);
});

// Typing
let typingTimeout;

chatInput.addEventListener('input', () => {
  socket.emit('typing', 'User');
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('stop typing');
  }, 1000);
});

socket.on('typing', (username) => {
  if (!document.getElementById('typing')) {
    const typing = document.createElement('div');
    typing.id = 'typing';
    typing.className = 'typing';
    typing.textContent = `${username} is typing...`;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

socket.on('stop typing', () => {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
});

// ⋮ 3-dot menu toggle
const menuButton = document.getElementById('menu-button');
const menuDropdown = document.getElementById('menu-dropdown');

menuButton.addEventListener('click', () => {
  menuDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!menuDropdown.contains(e.target) && e.target !== menuButton) {
    menuDropdown.classList.add('hidden');
  }
});

// 🧹 Clear Chat (local only)
document.getElementById('clear-chat')?.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  localStorage.removeItem('chat-messages');
  menuDropdown.classList.add('hidden');
});





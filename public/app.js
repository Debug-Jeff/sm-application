document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const token = localStorage.getItem('token');
  
  if (token) {
    showChat();
  } else {
    showLoginForm();
  }

  function showLoginForm() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="auth-container">
        <h2>Login</h2>
        <form id="loginForm">
          <input type="text" id="username" placeholder="Username" required>
          <input type="password" id="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="#" id="showRegister">Register</a></p>
      </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('showRegister').addEventListener('click', showRegisterForm);
  }

  function showRegisterForm() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="auth-container">
        <h2>Register</h2>
        <form id="registerForm">
          <input type="text" id="username" placeholder="Username" required>
          <input type="password" id="password" placeholder="Password" required>
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
      </div>
    `;

    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('showLogin').addEventListener('click', showLoginForm);
  }

  function showChat() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="chat-container">
        <div id="messages"></div>
        <form id="messageForm">
          <input type="text" id="messageInput" placeholder="Type a message..." required>
          <button type="submit">Send</button>
        </form>
      </div>
    `;

    document.getElementById('messageForm').addEventListener('submit', handleSendMessage);
    loadMessages();
  }

  async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        showChat();
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        showLoginForm();
        alert('Registration successful! Please login.');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    const content = document.getElementById('messageInput').value;

    try {
      socket.emit('sendMessage', { content });
      document.getElementById('messageInput').value = '';
    } catch (error) {
      console.error('Send message error:', error);
    }
  }

  async function loadMessages() {
    try {
      const response = await fetch('/messages', {
        headers: { 'Authorization': localStorage.getItem('token') }
      });

      if (response.ok) {
        const messages = await response.json();
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = messages.map(msg => 
          `<div class="message">${msg.content}</div>`
        ).join('');
      }
    } catch (error) {
      console.error('Load messages error:', error);
    }
  }

  socket.on('newMessage', (message) => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div class="message">${message.content}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
});

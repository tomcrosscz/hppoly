// app.js (Dual-mode + boot.js)
const form = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const statusSection = document.getElementById('status-section');
const banner = document.getElementById('status-banner');
const countdownEl = document.getElementById('countdown');
const restartNote = document.getElementById('restart-note');

const COUNTDOWN_SECONDS = Number(new URLSearchParams(location.search).get('t')) || 10;

function autoAuthCheck() {
  if (window.__AUTO_OK__) {
    showResult(true);
  }
}

function basicAuthHeader(user, pass) {
  const value = btoa(`${user}:${pass}`);
  return `Basic ${value}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuthHeader(username, password),
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    showResult(!!data.ok);
  } catch (err) {
    showResult(false);
  }
});

function showResult(success) {
  loginSection.classList.add('hidden');
  statusSection.classList.remove('hidden');

  if (success) {
    banner.textContent = 'SUCCESS';
    banner.className = 'banner success';
    restartNote.textContent = 'ACCESS SUCCESSFUL - RESTARTING APP';
  } else {
    banner.textContent = 'ACCESS DENIED';
    banner.className = 'banner denied';
    restartNote.textContent = 'ACCESS UNSUCCESSFUL - RESTARTING APP';
  }

  startCountdown(COUNTDOWN_SECONDS);
}

function startCountdown(seconds) {
  let s = seconds;
  countdownEl.textContent = s;
  const timer = setInterval(() => {
    s -= 1;
    countdownEl.textContent = s;
    if (s <= 0) {
      clearInterval(timer);
      location.replace(location.pathname);
    }
  }, 1000);
}

window.addEventListener('DOMContentLoaded', autoAuthCheck);

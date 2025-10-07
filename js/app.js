const body = document.body;
const toggleThemeButton = document.getElementById('toggleTheme');
const floatingChatButton = document.getElementById('floatingChatButton');
const chatWindow = document.querySelector('.chat-window');
const closeChatButton = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const chatMessageInput = document.getElementById('chatMessage');
const chatBody = document.querySelector('.chat-body');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const faqList = document.getElementById('faqList');

const THEME_KEY = 'live-support-theme';

function applyStoredTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === 'dark') {
    body.classList.add('dark');
    toggleThemeButton.textContent = 'Chuyển chế độ sáng';
  }
}

function toggleTheme() {
  const isDark = body.classList.toggle('dark');
  toggleThemeButton.textContent = isDark ? 'Chuyển chế độ sáng' : 'Chuyển chế độ tối';
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

function appendMessage({ author, text, time, type }) {
  const message = document.createElement('div');
  message.className = `message message--${type}`;
  message.innerHTML = `
    <span class="name">${author}</span>
    <p>${text}</p>
    <time>${time}</time>
  `;
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function handleChatSubmit(event) {
  event.preventDefault();
  const message = chatMessageInput.value.trim();
  if (!message) return;

  const now = new Date();
  const time = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  appendMessage({
    author: 'Bạn',
    text: message,
    time,
    type: 'user'
  });

  chatMessageInput.value = '';

  setTimeout(() => {
    appendMessage({
      author: 'Agent ảo',
      text: 'Cảm ơn bạn đã chia sẻ, mình sẽ cập nhật thông tin và phản hồi sớm nhất!',
      time,
      type: 'agent'
    });
  }, 900);
}

function toggleChatWindow(open) {
  chatWindow.style.display = open ? 'grid' : 'none';
}

function initFAQAccordion() {
  faqList.querySelectorAll('.faq-item__question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      faqList.querySelectorAll('.faq-item').forEach((faq) => faq.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

function handleContactSubmit(event) {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('fullName');
  formMessage.textContent = `${name}, cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ trong 24 giờ.`;
  contactForm.reset();
}

function initChart() {
  const ctx = document.getElementById('slaChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
      datasets: [
        {
          label: 'SLA - Thời gian phản hồi (phút)',
          data: [12, 10, 8, 7, 6, 9, 11],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2563eb'
        },
        {
          label: 'Mục tiêu SLA',
          data: [10, 10, 10, 10, 10, 10, 10],
          borderColor: '#f97316',
          borderDash: [6, 6],
          tension: 0.2,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text')
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted')
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.15)'
          }
        },
        y: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted')
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.15)'
          }
        }
      }
    }
  });
}

applyStoredTheme();
toggleThemeButton.addEventListener('click', toggleTheme);
floatingChatButton.addEventListener('click', () => toggleChatWindow(true));
closeChatButton.addEventListener('click', () => toggleChatWindow(false));
chatForm.addEventListener('submit', handleChatSubmit);
contactForm.addEventListener('submit', handleContactSubmit);
initFAQAccordion();
initChart();

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('*').forEach((el) => {
    el.style.transition = 'none';
  });
}

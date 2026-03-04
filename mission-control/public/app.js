// Mission Control App
const API = '/api';

// State
let tasks = [];
let contents = [];
let events = [];
let memories = [];
let team = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  updateTime();
  setInterval(updateTime, 1000);
  loadAll();
});

// Time
function updateTime() {
  document.getElementById('current-time').textContent = 
    new Date().toLocaleString('tr-TR', { 
      weekday: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
}

// Tabs
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

// Load All
async function loadAll() {
  await Promise.all([
    loadTasks(),
    loadContent(),
    loadCalendar(),
    loadMemory(),
    loadTeam()
  ]);
  renderOffice();
}

// ==================== TASKS ====================
async function loadTasks() {
  const res = await fetch(`${API}/tasks`);
  tasks = await res.json();
  renderTasks();
}

function renderTasks() {
  ['planned', 'in-progress', 'done'].forEach(status => {
    const container = document.getElementById(`tasks-${status}`);
    const filtered = tasks.filter(t => t.status === status);
    container.innerHTML = filtered.map(t => `
      <div class="task-card" onclick="editTask('${t.id}')">
        <h4>${escapeHtml(t.title)}</h4>
        <p>${escapeHtml(t.description || '')}</p>
        <span class="assignee">${getAssigneeEmoji(t.assignee)} ${t.assignee}</span>
      </div>
    `).join('');
  });
}

function getAssigneeEmoji(assignee) {
  const emojis = { kumky: '🐙', developer: '💻', writer: '✍️', designer: '🎨', researcher: '🔍', security: '🛡️' };
  return emojis[assignee] || '👤';
}

function showAddTask() {
  showModal('New Task', `
    <label>Title</label>
    <input type="text" name="title" required>
    <label>Description</label>
    <textarea name="description"></textarea>
    <label>Assignee</label>
    <select name="assignee">
      <option value="kumky">🐙 Kumky</option>
      <option value="developer">💻 Developer</option>
      <option value="writer">✍️ Writer</option>
      <option value="designer">🎨 Designer</option>
      <option value="researcher">🔍 Researcher</option>
    </select>
    <div class="form-actions">
      <button type="button" class="btn secondary" onclick="closeModal()">Cancel</button>
      <button type="submit" class="btn primary">Create</button>
    </div>
  `, async (form) => {
    await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title.value,
        description: form.description.value,
        assignee: form.assignee.value
      })
    });
    loadTasks();
    closeModal();
  });
}

async function editTask(id) {
  const task = tasks.find(t => t.id === id);
  showModal('Edit Task', `
    <label>Title</label>
    <input type="text" name="title" value="${escapeHtml(task.title)}" required>
    <label>Status</label>
    <select name="status">
      <option value="planned" ${task.status === 'planned' ? 'selected' : ''}>Planned</option>
      <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
      <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
    </select>
    <label>Assignee</label>
    <select name="assignee">
      <option value="kumky" ${task.assignee === 'kumky' ? 'selected' : ''}>🐙 Kumky</option>
      <option value="developer" ${task.assignee === 'developer' ? 'selected' : ''}>💻 Developer</option>
      <option value="writer" ${task.assignee === 'writer' ? 'selected' : ''}>✍️ Writer</option>
      <option value="designer" ${task.assignee === 'designer' ? 'selected' : ''}>🎨 Designer</option>
    </select>
    <div class="form-actions">
      <button type="button" class="btn secondary" onclick="deleteTask('${id}')">🗑️ Delete</button>
      <button type="submit" class="btn primary">Save</button>
    </div>
  `, async (form) => {
    await fetch(`${API}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title.value,
        status: form.status.value,
        assignee: form.assignee.value
      })
    });
    loadTasks();
    closeModal();
  });
}

async function deleteTask(id) {
  if (confirm('Delete this task?')) {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
    closeModal();
  }
}

// ==================== CONTENT ====================
async function loadContent() {
  const res = await fetch(`${API}/content`);
  contents = await res.json();
  renderContent();
}

function renderContent() {
  ['idea', 'script', 'review', 'ready', 'published'].forEach(stage => {
    const container = document.getElementById(`content-${stage}`);
    const filtered = contents.filter(c => c.stage === stage);
    container.innerHTML = filtered.map(c => `
      <div class="content-card" onclick="editContent('${c.id}')">
        <h4>${escapeHtml(c.title)}</h4>
        <small>${new Date(c.createdAt).toLocaleDateString('tr-TR')}</small>
      </div>
    `).join('');
  });
}

function showAddContent() {
  showModal('New Content', `
    <label>Title</label>
    <input type="text" name="title" required>
    <label>Script</label>
    <textarea name="script"></textarea>
    <div class="form-actions">
      <button type="button" class="btn secondary" onclick="closeModal()">Cancel</button>
      <button type="submit" class="btn primary">Create</button>
    </div>
  `, async (form) => {
    await fetch(`${API}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title.value,
        script: form.script.value
      })
    });
    loadContent();
    closeModal();
  });
}

async function editContent(id) {
  const content = contents.find(c => c.id === id);
  showModal('Edit Content', `
    <label>Title</label>
    <input type="text" name="title" value="${escapeHtml(content.title)}" required>
    <label>Stage</label>
    <select name="stage">
      <option value="idea" ${content.stage === 'idea' ? 'selected' : ''}>💡 Idea</option>
      <option value="script" ${content.stage === 'script' ? 'selected' : ''}>📜 Script</option>
      <option value="review" ${content.stage === 'review' ? 'selected' : ''}>👀 Review</option>
      <option value="ready" ${content.stage === 'ready' ? 'selected' : ''}>✅ Ready</option>
      <option value="published" ${content.stage === 'published' ? 'selected' : ''}>🚀 Published</option>
    </select>
    <label>Script</label>
    <textarea name="script">${escapeHtml(content.script || '')}</textarea>
    <div class="form-actions">
      <button type="submit" class="btn primary">Save</button>
    </div>
  `, async (form) => {
    await fetch(`${API}/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title.value,
        stage: form.stage.value,
        script: form.script.value
      })
    });
    loadContent();
    closeModal();
  });
}

// ==================== CALENDAR ====================
async function loadCalendar() {
  const res = await fetch(`${API}/calendar`);
  events = await res.json();
  renderCalendar();
}

function renderCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let html = '';
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day"></div>';
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === date);
    const isToday = day === today.getDate();
    
    html += `
      <div class="calendar-day ${isToday ? 'today' : ''}">
        <div class="day-number">${day}</div>
        ${dayEvents.map(e => `
          <div class="calendar-event ${e.type}" onclick="editEvent('${e.id}')">${escapeHtml(e.title)}</div>
        `).join('')}
      </div>
    `;
  }
  
  document.getElementById('calendar-grid').innerHTML = html;
}

function showAddEvent() {
  const today = new Date().toISOString().split('T')[0];
  showModal('New Event', `
    <label>Title</label>
    <input type="text" name="title" required>
    <label>Date</label>
    <input type="date" name="date" value="${today}" required>
    <label>Time</label>
    <input type="time" name="time">
    <label>Type</label>
    <select name="type">
      <option value="task">Task</option>
      <option value="meeting">Meeting</option>
      <option value="reminder">Reminder</option>
      <option value="cron">Cron Job</option>
    </select>
    <div class="form-actions">
      <button type="button" class="btn secondary" onclick="closeModal()">Cancel</button>
      <button type="submit" class="btn primary">Create</button>
    </div>
  `, async (form) => {
    await fetch(`${API}/calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title.value,
        date: form.date.value,
        time: form.time.value,
        type: form.type.value
      })
    });
    loadCalendar();
    closeModal();
  });
}

async function editEvent(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;
  showModal('Event Details', `
    <p><strong>${escapeHtml(event.title)}</strong></p>
    <p>Date: ${event.date} ${event.time || ''}</p>
    <p>Type: ${event.type}</p>
    <div class="form-actions">
      <button type="button" class="btn secondary" onclick="deleteEvent('${id}')">🗑️ Delete</button>
      <button type="button" class="btn primary" onclick="closeModal()">Close</button>
    </div>
  `);
}

async function deleteEvent(id) {
  if (confirm('Delete this event?')) {
    await fetch(`${API}/calendar/${id}`, { method: 'DELETE' });
    loadCalendar();
    closeModal();
  }
}

// ==================== MEMORY ====================
async function loadMemory() {
  const res = await fetch(`${API}/memory`);
  memories = await res.json();
  renderMemoryNav();
  
  // Search
  document.getElementById('memory-search').addEventListener('input', debounce(searchMemory, 300));
}

function renderMemoryNav() {
  const nav = document.getElementById('memory-nav');
  nav.innerHTML = memories.map((m, i) => `
    <div class="memory-item ${i === 0 ? 'active' : ''}" onclick="showMemory(${i})">
      ${m.type === 'long-term' ? '🧠' : '📅'} ${m.title}
    </div>
  `).join('');
  
  if (memories.length > 0) showMemory(0);
}

function showMemory(index) {
  const memory = memories[index];
  document.querySelectorAll('.memory-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  
  document.getElementById('memory-content').innerHTML = `
    <h3>${memory.title}</h3>
    <pre>${escapeHtml(memory.content)}</pre>
  `;
}

async function searchMemory(e) {
  const query = e.target.value;
  if (!query) {
    renderMemoryNav();
    return;
  }
  
  const res = await fetch(`${API}/memory/search?q=${encodeURIComponent(query)}`);
  const results = await res.json();
  
  const content = document.getElementById('memory-content');
  if (results.length === 0) {
    content.innerHTML = '<p class="hint">No results found</p>';
  } else {
    content.innerHTML = results.map(r => `
      <h4>${r.title}</h4>
      ${r.matches.map(m => `<p>${escapeHtml(m)}</p>`).join('')}
      <hr>
    `).join('');
  }
}

// ==================== TEAM ====================
async function loadTeam() {
  const res = await fetch(`${API}/team`);
  team = await res.json();
  renderTeam();
}

function renderTeam() {
  const grid = document.getElementById('team-grid');
  grid.innerHTML = team.map(m => `
    <div class="team-card">
      <div class="avatar">${m.avatar}</div>
      <h4>${m.name}</h4>
      <p class="role">${m.role}</p>
      <span class="status-badge ${m.status}">${m.status}</span>
    </div>
  `).join('');
}

// ==================== OFFICE ====================
async function renderOffice() {
  const res = await fetch(`${API}/office`);
  const office = await res.json();
  
  const floor = document.getElementById('office-floor');
  floor.innerHTML = office.map(m => `
    <div class="desk" style="left: ${m.position.x}%; top: ${m.position.y}%;" title="${m.name}">
      <span class="avatar">${m.avatar}</span>
      <span class="name">${m.name.split(' ')[0]}</span>
    </div>
  `).join('');
}

// ==================== MODAL ====================
function showModal(title, formHtml, onSubmit) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-form').innerHTML = formHtml;
  document.getElementById('modal').classList.remove('hidden');
  
  const form = document.getElementById('modal-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

// ==================== UTILS ====================
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

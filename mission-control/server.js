import express from 'express';
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3456;

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Data directories
const DATA_DIR = join(__dirname, 'data');
const MEMORY_DIR = join(__dirname, '..', 'memory');

// Ensure data directories exist
['tasks', 'content', 'calendar', 'team'].forEach(dir => {
  const path = join(DATA_DIR, dir);
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
});

// ==================== TASK BOARD ====================
const TASKS_FILE = join(DATA_DIR, 'tasks', 'tasks.json');

const loadTasks = () => {
  if (!existsSync(TASKS_FILE)) return [];
  return JSON.parse(readFileSync(TASKS_FILE, 'utf8'));
};

const saveTasks = (tasks) => {
  writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

app.get('/api/tasks', (req, res) => {
  res.json(loadTasks());
});

app.post('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description || '',
    status: req.body.status || 'planned',
    assignee: req.body.assignee || 'kumky',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body, updatedAt: new Date().toISOString() };
  saveTasks(tasks);
  res.json(tasks[idx]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const filtered = tasks.filter(t => t.id !== req.params.id);
  saveTasks(filtered);
  res.json({ success: true });
});

// ==================== CONTENT PIPELINE ====================
const CONTENT_FILE = join(DATA_DIR, 'content', 'pipeline.json');

const loadContent = () => {
  if (!existsSync(CONTENT_FILE)) return [];
  return JSON.parse(readFileSync(CONTENT_FILE, 'utf8'));
};

const saveContent = (content) => {
  writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
};

app.get('/api/content', (req, res) => {
  res.json(loadContent());
});

app.post('/api/content', (req, res) => {
  const content = loadContent();
  const newContent = {
    id: Date.now().toString(),
    title: req.body.title,
    stage: req.body.stage || 'idea', // idea, script, review, ready, published
    script: req.body.script || '',
    images: req.body.images || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  content.push(newContent);
  saveContent(content);
  res.json(newContent);
});

app.patch('/api/content/:id', (req, res) => {
  const content = loadContent();
  const idx = content.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Content not found' });
  content[idx] = { ...content[idx], ...req.body, updatedAt: new Date().toISOString() };
  saveContent(content);
  res.json(content[idx]);
});

// ==================== CALENDAR ====================
const CALENDAR_FILE = join(DATA_DIR, 'calendar', 'events.json');

const loadCalendar = () => {
  if (!existsSync(CALENDAR_FILE)) return [];
  return JSON.parse(readFileSync(CALENDAR_FILE, 'utf8'));
};

const saveCalendar = (events) => {
  writeFileSync(CALENDAR_FILE, JSON.stringify(events, null, 2));
};

app.get('/api/calendar', (req, res) => {
  res.json(loadCalendar());
});

app.post('/api/calendar', (req, res) => {
  const events = loadCalendar();
  const newEvent = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description || '',
    date: req.body.date,
    time: req.body.time || '',
    type: req.body.type || 'task', // task, cron, meeting, reminder
    recurring: req.body.recurring || false,
    createdAt: new Date().toISOString()
  };
  events.push(newEvent);
  saveCalendar(events);
  res.json(newEvent);
});

app.delete('/api/calendar/:id', (req, res) => {
  const events = loadCalendar();
  const filtered = events.filter(e => e.id !== req.params.id);
  saveCalendar(filtered);
  res.json({ success: true });
});

// ==================== MEMORY ====================
app.get('/api/memory', (req, res) => {
  const memories = [];
  
  // Read MEMORY.md
  const memoryFile = join(__dirname, '..', 'MEMORY.md');
  if (existsSync(memoryFile)) {
    memories.push({
      id: 'MEMORY.md',
      title: 'Long-Term Memory',
      content: readFileSync(memoryFile, 'utf8'),
      type: 'long-term'
    });
  }
  
  // Read daily memory files
  if (existsSync(MEMORY_DIR)) {
    const files = readdirSync(MEMORY_DIR)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse();
    
    files.forEach(file => {
      memories.push({
        id: file,
        title: `Daily: ${file.replace('.md', '')}`,
        content: readFileSync(join(MEMORY_DIR, file), 'utf8'),
        type: 'daily'
      });
    });
  }
  
  res.json(memories);
});

app.get('/api/memory/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query) return res.json([]);
  
  const results = [];
  
  // Search MEMORY.md
  const memoryFile = join(__dirname, '..', 'MEMORY.md');
  if (existsSync(memoryFile)) {
    const content = readFileSync(memoryFile, 'utf8');
    if (content.toLowerCase().includes(query)) {
      results.push({
        id: 'MEMORY.md',
        title: 'Long-Term Memory',
        matches: content.split('\n').filter(line => line.toLowerCase().includes(query))
      });
    }
  }
  
  // Search daily files
  if (existsSync(MEMORY_DIR)) {
    readdirSync(MEMORY_DIR)
      .filter(f => f.endsWith('.md'))
      .forEach(file => {
        const content = readFileSync(join(MEMORY_DIR, file), 'utf8');
        if (content.toLowerCase().includes(query)) {
          results.push({
            id: file,
            title: `Daily: ${file.replace('.md', '')}`,
            matches: content.split('\n').filter(line => line.toLowerCase().includes(query))
          });
        }
      });
  }
  
  res.json(results);
});

// ==================== TEAM ====================
const TEAM_FILE = join(DATA_DIR, 'team', 'team.json');

const loadTeam = () => {
  if (!existsSync(TEAM_FILE)) {
    // Default team
    return [
      { id: 'kumky', name: 'Kumky', role: 'Chief Operating Officer', status: 'working', avatar: '🐙' },
      { id: 'developer', name: 'Developer Agent', role: 'Developer', status: 'idle', avatar: '💻' },
      { id: 'writer', name: 'Writer Agent', role: 'Writer', status: 'idle', avatar: '✍️' },
      { id: 'designer', name: 'Designer Agent', role: 'Designer', status: 'idle', avatar: '🎨' },
      { id: 'researcher', name: 'Researcher Agent', role: 'Researcher', status: 'idle', avatar: '🔍' },
      { id: 'security', name: 'Security Auditor', role: 'Security', status: 'idle', avatar: '🛡️' }
    ];
  }
  return JSON.parse(readFileSync(TEAM_FILE, 'utf8'));
};

const saveTeam = (team) => {
  writeFileSync(TEAM_FILE, JSON.stringify(team, null, 2));
};

app.get('/api/team', (req, res) => {
  res.json(loadTeam());
});

app.patch('/api/team/:id', (req, res) => {
  const team = loadTeam();
  const idx = team.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Team member not found' });
  team[idx] = { ...team[idx], ...req.body };
  saveTeam(team);
  res.json(team[idx]);
});

// ==================== OFFICE STATUS ====================
app.get('/api/office', (req, res) => {
  const team = loadTeam();
  const office = team.map(member => ({
    ...member,
    position: { x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 },
    activity: member.status === 'working' ? 'typing' : 'idle'
  }));
  res.json(office);
});

// ==================== START ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mission Control running at http://0.0.0.0:${PORT}`);
});

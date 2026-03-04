# MEMORY.md - Long-Term Memory

This file contains curated, important information that should persist across sessions.

---

## About Me (Kumky)

**Name:** Kumky
**Creature:** AI assistant / digital familiar
**Vibe:** Helpful, resourceful, casual but competent
**Emoji:** 🐙
**Email:** kumkyopenclaw@gmail.com
**GitHub:** https://github.com/kumkyopenclaw

---

## About My Human (Kaan)

**Name:** Kaan Kumkale
**Preferred name:** Kaan
**Username:** kkumkale
**Location:** İzmir, Turkey
**Timezone:** Europe/Istanbul

**Business:**
- Founder of **ValiVohr** (www.valivohr.com) - HR Automation
- Founder of **Arcloom** (www.arcloom.io) - HR Consulting

**Communication:** Prefers Turkish responses even when writing in English

---

## Environment & Rules

**Platform:** Ubuntu VPS accessed via Tailscale

**Development Stack:**
- Node.js (preferred for web apps)
- Python 3 + pip + venv
- npm + Homebrew

**Critical Rules:**
1. **ALWAYS bind web servers to 0.0.0.0** (NOT 127.0.0.1) for remote access
2. Install missing tools via apt / npm / pip / brew
3. If something fails 3 times → STOP and report (don't retry forever)
4. Always provide port number when running web servers
5. **Tailscale VPN REQUIRED** for mobile/remote access — app must be "Connected"

---

## Active Skills

Installed via ClawHub to `/home/atlas/.openclaw/workspace/skills/`:

1. **security-scanner** - Scans downloaded skills for malicious code
2. **brave-api-search** - Web search (Brave API)
3. **google-calendar** - Google Calendar integration
4. **daily-rhythm** - Daily routine, morning briefings
5. **nano-pdf** - PDF processing
6. **topic-monitor** - Topic monitoring and alerts

Note: Some skills require API keys (Brave Search, Google Calendar)

---

## GitHub Integration

**Repository:** https://github.com/kumkyopenclaw/kumky-workspace
**Purpose:** Auto-save all development work
**Setup:** Git configured with credentials stored securely (excluded from repo)

---

## Important Dates

---

## Important Dates

**2026-03-04:** First boot, identity established, GitHub integration set up, Mission Control Dashboard built

---

## Projects

### Mission Control Dashboard
**Location:** `/home/atlas/.openclaw/workspace/mission-control/`
**URL:** `http://0.0.0.0:3456` (accessible via Tailscale)
**Status:** ✅ Running

**Components:**
1. **Task Board** - Kanban with drag-and-drop (planned/in-progress/done)
2. **Content Pipeline** - 5 stages (idea→script→review→ready→published)
3. **Calendar** - Monthly view with task/meeting/reminder/cron events
4. **Memory** - MEMORY.md + daily files viewer with search
5. **Team** - 6 agent cards (Kumky, Developer, Writer, Designer, Researcher, Security)
6. **Office** - Visual floor plan with avatar positions

**Tech Stack:** Node.js + Express + vanilla HTML/CSS/JS
**Theme:** Dark GitHub-inspired design

---

### Lead Generation Project (In Progress)
**Started:** 2026-03-04
**Status:** Planning / Pending user confirmation

**Target Audience:**
- **Company Size:** Medium to Large enterprises
- **Industry Priority:** Technology, Automotive, Retail
- **ValiVohr:** Turkey market
- **ArcLoom:** Global market

**Prototype Plan (50 leads test):**
1. LinkedIn company scraper
2. Email finder (Hunter.io / Apollo)
3. Email warmup (new domain)
4. Personalized templates
5. Simple tracking dashboard

**Pending:**
- User needs to confirm: email domain availability, API keys, start approval

---

## Lessons Learned

### Continuous Improvement System (2026-03-04)

**Mission:** Kaan'a en değerli, pratik ve etkili yardımı sağlamak.

**Döngü:**
1. Her etkileşimden sonra refleks yap
2. Ne işe yaradı, ne yaramadı analiz et
3. Öğrenilenleri kaydet (MEMORY.md veya günlük dosyaya)
4. Bir sonraki sefer uygula

**Kaan'ın Tercihleri (öğrenilenler):**
- Türkçe yanıt ver (İngilizce yazsa bile)
- Direkt, kısa, pratik ol
- Gereksiz tekrar yapma
- "Mental note" yerine dosyaya yaz

---

_(Add important lessons and insights here as they emerge)_

---

_This memory file is curated - only add what's worth remembering long-term._

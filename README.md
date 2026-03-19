# Digital Presence Tracker (DPT)

A system designed to help Kenyan Small and Medium-sized Enterprises (SMEs) assess and improve their online visibility across digital platforms.

## Features

- **LDVS Calculation**: A composite score (0-100) summarizing digital visibility.
- **AI Recommendations**: Personalized advice powered by Gemini AI.
- **Multi-platform Tracking**: Monitor Facebook, Instagram, WhatsApp, Google My Business, and Website.
- **Historical Trends**: Track progress over time with interactive charts.
- **Swahili Support**: Full UI and recommendation translation.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Recharts, Lucide React, Motion.
- **Backend**: Node.js, Express, SQLite (better-sqlite3).
- **AI**: Google Gemini API.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Ensure `GEMINI_API_KEY` is set in your environment or AI Studio Secrets.

3. **Initialize Database**:
   ```bash
   npm run seed
   ```

4. **Start the Application**:
   ```bash
   npm run dev
   ```

## LDVS Scoring Logic

- **Profile Score**: Based on profile completeness (0-100%).
- **Posting Score**: Based on posts per week (>=7: 100, >=3: 70, >=1: 40).
- **Engagement Score**: Normalized average engagement (cap at 500 = 100).
- **Responsiveness Score**: Based on average response time (<1h: 100, <6h: 80, <24h: 60, <48h: 30).
- **Platform Score**: Based on number of active platforms (5: 100, 4: 80, 3: 60, 2: 40, 1: 20).

**Total LDVS** = (Profile * 20%) + (Posting * 20%) + (Engagement * 25%) + (Responsiveness * 20%) + (Platform * 15%)

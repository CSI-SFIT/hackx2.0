# Quick Start - Auditor Dashboard

## What's Installed

✅ Organizer-only audit dashboard at `/admin/auditor`  
✅ GitHub API integration for repository analysis  
✅ 6 automated flag detectors for suspicious submissions  
✅ Recharts integration for data visualization  
✅ Full TypeScript support  

## 3 Steps to Use

### 1️⃣ Create GitHub Token
- Go to https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select `repo` scope only
- Copy the token

### 2️⃣ Configure Environment
Edit `.env.local` and add:
```env
GITHUB_TOKEN="ghp_paste_your_token_here"
HACKATHON_START_DATE="2025-01-15T00:00:00Z"
```

### 3️⃣ Access Dashboard
- Log in as admin user (role: 'admin')
- Go to `/admin/auditor`
- Wait for audits to complete (~3-5 sec per repo)

## What You'll See

**Submission Cards** with:
- ✅ Verdict badge (Clean / Review Needed / Suspicious)
- 📊 Commit frequency bar chart
- 👥 Top 5 contributors breakdown
- 🚩 Detected flags list with explanations
- 📈 Stats (total commits, contributors)

## Flags Detected

| Flag | When It Triggers |
|------|------------------|
| 🔴 **Fork** | Repository is a fork |
| 🔴 **Pre-Hackathon Commits** | Commits before start date |
| ⚠️ **Commit Burst** | 3+ commits in last hour |
| ⚠️ **Single Contributor** | Only 1 developer |
| ⚠️ **Low-Quality Messages** | >30% commits < 10 chars |
| ⚠️ **Missing README** | No README file |

**Legend**: 🔴 = Critical | ⚠️ = Warning

## Verdict Logic

| Condition | Result |
|-----------|--------|
| Any critical flag OR 3+ total flags | 🔴 **Suspicious** |
| 1-2 warning flags | 🟡 **Review Needed** |
| No flags | ✅ **Clean** |

## Files Created

```
app/
├── api/
│   └── audit/route.ts          → GitHub data fetching API
├── admin/auditor/
│   ├── page.tsx                → Dashboard page
│   ├── submission-card.tsx      → Card component with charts
│   └── actions.ts              → Server actions
libs/
└── utils/
    └── audit.ts                → Audit logic & flag detection
ui/components/basic/
└── card.tsx                    → UI Card component
AUDITOR_DASHBOARD.md            → Full documentation
.env.example                    → Environment template
```

## Customization

**Change verdict thresholds?**  
Edit `libs/utils/audit.ts` line 133

**Add new flags?**  
Add to `auditSubmission()` function in `libs/utils/audit.ts`

**Modify colors?**  
Edit `submission-card.tsx` verdictConfig object

**Change commit message quality threshold?**  
Edit `libs/utils/audit.ts` line 109

## Rate Limits

- GitHub: 5000 requests/hour (with token)
- Audits: ~21 repos per minute (sequential)
- Commits: Max 300 per repo (3 pages × 100)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Organizer access required" | User needs `role: 'admin'` in profiles table |
| "GITHUB_TOKEN not set" | Add token to .env.local, restart dev server |
| "Repository not found" | Check GitHub URL format, public/private access |
| Slow audits | Normal for repos with many commits |

## Documentation

Full guide: See `AUDITOR_DASHBOARD.md` in project root

## Ready! 🚀

Configure the 2 env variables and you're all set. Visit `/admin/auditor` with an admin account to audit submissions!

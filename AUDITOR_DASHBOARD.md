# Auditor Dashboard - Setup & Usage Guide

## Overview

The **Auditor Dashboard** (`/admin/auditor`) is an organizer-only feature that allows hackathon organizers to audit and analyze team project repositories. It automatically fetches repository data from GitHub, analyzes commit patterns, and flags suspicious activities.

## Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
# GitHub Personal Access Token
# Create at: https://github.com/settings/tokens
# Required scopes: repo (full control of private repositories)
GITHUB_TOKEN="ghp_your_token_here"

# Hackathon start date (ISO 8601 format)
# Commits made before this date will be flagged
HACKATHON_START_DATE="2025-01-15T00:00:00Z"
```

### 2. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select the `repo` scope
4. Copy the token and add it to `.env.local` as `GITHUB_TOKEN`

### 3. Database Schema

Ensure your Supabase `submissions` table has these columns:

```sql
- id (UUID, primary key)
- team_name (text)
- github_url (text)
- project_title (text)
- created_at (timestamp)
```

## Usage

### Accessing the Dashboard

1. Log in with an account that has `role: 'admin'` in the profiles table
2. Navigate to `/admin/auditor`
3. The dashboard will automatically fetch all submissions and audit them

### Understanding the Audit Results

#### Verdict Badges

- **Clean** (Green) - No flags detected
- **Review Needed** (Yellow) - 1-2 flags detected, manual review recommended
- **Suspicious** (Red) - 3+ flags OR critical flags detected

#### Detected Flags

| Flag | Severity | Description |
|------|----------|-------------|
| **Repository is a fork** | Critical | Repository is a fork of another project |
| **Commits before hackathon start** | Critical | Commits dated before `HACKATHON_START_DATE` |
| **Commit burst in last hour** | Warning | 3+ commits within the last hour |
| **Only one contributor** | Warning | Repository has commits from only one developer |
| **Low-quality commit messages** | Warning | >30% of commits have messages < 10 chars |
| **Missing README** | Warning | Repository lacks a README file |

### Dashboard Features

**Statistics Summary**
- Total submissions audited
- Clean submissions count
- Suspicious submissions count

**Per-Submission Card**
- Team name and GitHub repository link
- Verdict badge with severity indicator
- Total commits count
- Contributor count
- Commit frequency bar chart (last 30 commits)
- Top 5 contributors with contribution breakdown
- List of all flags with explanations

## How It Works

### Architecture

```
┌─────────────────┐
│ Auditor Page    │
├─────────────────┤
│ - Auth check    │
│ - Load submiss. │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ POST /api/audit     │
├─────────────────────┤
│ - Parse GitHub URL  │
│ - Fetch repo info   │
│ - Get commits (300) │
│ - Get contributors  │
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│ auditSubmission()    │
├──────────────────────┤
│ - Detect flags       │
│ - Calculate verdict  │
│ - Build stats        │
└──────────────────────┘
```

### Data Flow

1. **Page Load** - Fetches all submissions from Supabase `submissions` table
2. **Parsing** - Extracts GitHub owner/repo from URLs (supports `github.com/user/repo` and `git@github.com:user/repo`)
3. **API Audit** - POST to `/api/audit` with `{owner, repo}` to fetch:
   - Repository metadata (fork status, default branch)
   - Up to 300 commits (paginated in batches of 100)
   - Up to 100 contributors
4. **Flag Detection** - Runs 6 audit checks against the fetched data
5. **Verdict Calculation** - Maps flags to overall verdict:
   - Critical flags or 3+ total flags → Suspicious
   - 1-2 flags → Review Needed
   - No flags → Clean
6. **Rendering** - Displays comprehensive card per submission with charts and breakdown

## API Reference

### POST /api/audit

**Request Body:**
```json
{
  "owner": "github_username",
  "repo": "repository_name"
}
```

**Response (Success):**
```json
{
  "success": true,
  "repoData": {
    "name": "repo_name",
    "html_url": "https://github.com/owner/repo",
    "fork": false,
    "default_branch": "main"
  },
  "commits": [...],
  "contributors": [...]
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Server Actions

### fetchSubmissions()

Fetches all submissions from the database.

```typescript
const submissions = await fetchSubmissions();
// Returns: Submission[]
```

### checkReadme(owner, repo)

Checks if a repository has a README file.

```typescript
const hasReadme = await checkReadme("owner", "repo");
// Returns: boolean
```

## Audit Logic Functions

### auditSubmission(commits, contributors, isFork, repoHasReadme)

Performs comprehensive audit analysis.

```typescript
import { auditSubmission } from "@/libs/utils/audit";

const result = auditSubmission(
  commits,       // GithubCommit[]
  contributors,  // GithubContributor[]
  isFork,        // boolean
  repoHasReadme  // boolean
);

// Returns: AuditResult
// {
//   flags: AuditFlag[],
//   verdict: "Clean" | "Review Needed" | "Suspicious",
//   stats: {
//     totalCommits: number,
//     uniqueContributors: number,
//     commitFrequency: Array,
//     contributorBreakdown: Array
//   }
// }
```

## Customization

### Adjusting Flag Thresholds

Edit `/libs/utils/audit.ts`:

```typescript
// Low-quality commits threshold (currently 30%)
if (lowQualityCommits.length > commits.length * 0.3) { ... }

// Single contributor threshold (currently 1)
if (uniqueContributors <= 1) { ... }

// Commit burst threshold (currently 3 in last hour)
if (recentCommits.length >= 3) { ... }

// Low-quality message threshold (currently < 10 chars)
const lowQualityCommits = commits.filter(
  (c) => c.commit.message.trim().length < 10
);
```

### Changing Verdict Logic

Edit `auditSubmission()` verdict calculation:

```typescript
// Current logic:
// - 1+ critical flags OR 3+ total flags → Suspicious
// - 1+ any flags → Review Needed
// - No flags → Clean
```

### Adding New Flags

Add to `auditSubmission()`:

```typescript
flags.push({
  id: "unique_flag_id",
  title: "Flag Title",
  description: "Detailed explanation",
  severity: "warning" | "critical",
});
```

## Troubleshooting

### "GITHUB_TOKEN environment variable not set"
- Add `GITHUB_TOKEN` to `.env.local`
- Restart dev server (env changes require restart)

### "Repository not found" or "404 errors"
- Verify GitHub URL format: `https://github.com/owner/repo`
- Ensure the repository is public or token has access
- Check GitHub API rate limits (5000 req/hour with token)

### "Organizer access required"
- Ensure user has `role: 'admin'` in the profiles table
- Log out and log back in to refresh the session

### Rate Limiting
- GitHub API: 5000 requests per hour with authentication
- With ~300 commits per repo + 1 repo request + 1 contributors request:
  - Can audit ~1250 repositories per hour
  - Or ~21 repositories per minute

### Slow Audit Process
- Commit fetching is paginated (100 per request)
- Audits run sequentially to avoid rate limiting
- Use browser DevTools Network tab to diagnose slow endpoints

## Performance Notes

- **Concurrent Audits**: Currently sequential to prevent rate limiting
- **Pagination**: Fetches up to 300 commits per repo (3 requests × 100)
- **Caching**: No caching; data fetched fresh on each page load
- **Large Repos**: May take 30-60 seconds to complete audit

For optimization:
- Implement caching with Redis/Memcached
- Run audits asynchronously in background jobs
- Batch multiple repos into single GitHub API calls

## Security

- ✅ Only accessible to users with `role: 'admin'`
- ✅ Uses server actions for protected operations
- ✅ GitHub token stored in server-side env variables (not exposed to client)
- ✅ No sensitive data logged or stored
- ⚠️ Rate limiting: Implement if many submissions expected

## Future Enhancements

- [ ] Cache audit results (TTL-based invalidation)
- [ ] Bulk re-audit action
- [ ] Export audit results (CSV/PDF)
- [ ] Custom flag configuration per hackathon
- [ ] Webhook integration for real-time updates
- [ ] Advanced filtering and sorting
- [ ] Commit history timeline visualization
- [ ] Multi-language commit message quality analysis

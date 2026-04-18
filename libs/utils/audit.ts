interface Commit {
  commit: {
    author: {
      date: string;
      name: string;
      email: string;
    };
    message: string;
  };
  author: {
    login: string;
  } | null;
}

interface Contributor {
  login: string;
  contributions: number;
}

export interface AuditFlag {
  id: string;
  title: string;
  description: string;
  severity: "warning" | "critical";
}

export interface AuditResult {
  flags: AuditFlag[];
  verdict: "Clean" | "Review Needed" | "Suspicious";
  stats: {
    totalCommits: number;
    uniqueContributors: number;
    commitFrequency: { date: string; count: number }[];
    contributorBreakdown: { name: string; commits: number }[];
  };
}

function parseDate(dateString: string): Date {
  return new Date(dateString);
}

export function auditSubmission(
  commits: Commit[],
  contributors: Contributor[],
  isFork: boolean,
  repoHasReadme: boolean
): AuditResult {
  const flags: AuditFlag[] = [];
  const hackathonStartStr = process.env.HACKATHON_START_DATE || "2025-01-01T00:00:00Z";
  const hackathonStart = parseDate(hackathonStartStr);

  // Flag 1: Fork detection
  if (isFork) {
    flags.push({
      id: "fork",
      title: "Repository is a fork",
      description: "This repository is a fork of another project. Verify original contribution.",
      severity: "critical",
    });
  }

  // Flag 2: Commits before hackathon start date
  const commitsBeforeStart = commits.filter(
    (c) => parseDate(c.commit.author.date) < hackathonStart
  );
  if (commitsBeforeStart.length > 0) {
    flags.push({
      id: "pre_hackathon",
      title: `${commitsBeforeStart.length} commits before hackathon start`,
      description: `Found ${commitsBeforeStart.length} commits dated before ${hackathonStart.toLocaleDateString()}`,
      severity: "critical",
    });
  }

  // Flag 3: Commit burst in last hour
  if (commits.length > 0) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentCommits = commits.filter(
      (c) => parseDate(c.commit.author.date) > oneHourAgo
    );
    if (recentCommits.length >= 3) {
      flags.push({
        id: "burst",
        title: `${recentCommits.length} commits in last hour`,
        description: "Unusual commit frequency detected in the last hour",
        severity: "warning",
      });
    }
  }

  // Flag 4: Single contributor
  const uniqueContributors = new Set(
    commits.map((c) => c.author?.login || c.commit.author.email)
  ).size;
  if (uniqueContributors <= 1) {
    flags.push({
      id: "single_contributor",
      title: "Only one contributor",
      description: "Repository has commits from only one developer",
      severity: "warning",
    });
  }

  // Flag 5: Low-quality commit messages
  const lowQualityCommits = commits.filter(
    (c) => c.commit.message.trim().length < 10
  );
  if (lowQualityCommits.length > commits.length * 0.3) {
    flags.push({
      id: "low_quality_commits",
      title: `${lowQualityCommits.length} commits with poor messages`,
      description: "More than 30% of commits have messages shorter than 10 characters",
      severity: "warning",
    });
  }

  // Flag 6: Missing README
  if (!repoHasReadme) {
    flags.push({
      id: "no_readme",
      title: "Missing README",
      description: "Repository does not have a README file",
      severity: "warning",
    });
  }

  // Determine verdict based on flag severity and count
  const criticalFlags = flags.filter((f) => f.severity === "critical").length;
  const warningFlags = flags.filter((f) => f.severity === "warning").length;

  let verdict: "Clean" | "Review Needed" | "Suspicious";
  if (criticalFlags > 0 || (warningFlags + criticalFlags) >= 3) {
    verdict = "Suspicious";
  } else if (warningFlags > 0 || criticalFlags > 0) {
    verdict = "Review Needed";
  } else {
    verdict = "Clean";
  }

  // Build commit frequency data
  const commitsByDate: Record<string, number> = {};
  commits.forEach((c) => {
    const date = new Date(c.commit.author.date);
    const dateStr = date.toISOString().split("T")[0];
    commitsByDate[dateStr] = (commitsByDate[dateStr] || 0) + 1;
  });

  const commitFrequency = Object.entries(commitsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Build contributor breakdown
  const contributorMap: Record<string, number> = {};
  commits.forEach((c) => {
    const name = c.author?.login || c.commit.author.name;
    contributorMap[name] = (contributorMap[name] || 0) + 1;
  });

  const contributorBreakdown = Object.entries(contributorMap)
    .map(([name, commits]) => ({ name, commits }))
    .sort((a, b) => b.commits - a.commits);

  return {
    flags,
    verdict,
    stats: {
      totalCommits: commits.length,
      uniqueContributors,
      commitFrequency,
      contributorBreakdown,
    },
  };
}

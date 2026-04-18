import { NextRequest, NextResponse } from "next/server";

interface GithubRepo {
  fork: boolean;
  default_branch: string;
}

interface GithubCommit {
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

interface GithubContributor {
  login: string;
  contributions: number;
}

export interface AuditResponse {
  success: boolean;
  error?: string;
  repoData?: GithubRepo & { name: string; html_url: string };
  commits?: GithubCommit[];
  contributors?: GithubContributor[];
}

async function fetchGithubAPI(
  url: string,
  headers: Record<string, string> = {}
): Promise<any> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable not set");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      ...headers,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository not found");
    }
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function POST(request: NextRequest): Promise<NextResponse<AuditResponse>> {
  try {
    const body = await request.json();
    const { owner, repo } = body;

    if (!owner || !repo) {
      return NextResponse.json(
        { success: false, error: "Missing owner or repo parameter" },
        { status: 400 }
      );
    }

    // Fetch repo data
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoData = await fetchGithubAPI(repoUrl);

    // Fetch commits (paginated, max 300)
    const commits: GithubCommit[] = [];
    let page = 1;
    const perPage = 100;
    const maxPages = 3; // 100 * 3 = 300 commits

    for (page = 1; page <= maxPages; page++) {
      const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`;
      const pageCommits = await fetchGithubAPI(commitsUrl);

      if (!Array.isArray(pageCommits) || pageCommits.length === 0) {
        break;
      }

      commits.push(...pageCommits);

      if (pageCommits.length < perPage) {
        break;
      }
    }

    // Fetch contributors
    const contributorsUrl = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`;
    let contributors: GithubContributor[] = [];
    try {
      contributors = await fetchGithubAPI(contributorsUrl);
      if (!Array.isArray(contributors)) {
        contributors = [];
      }
    } catch (err) {
      // Contributors endpoint might fail, continue without it
      contributors = [];
    }

    return NextResponse.json({
      success: true,
      repoData: {
        ...repoData,
        name: repoData.name,
        html_url: repoData.html_url,
        fork: repoData.fork,
        default_branch: repoData.default_branch,
      },
      commits,
      contributors,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

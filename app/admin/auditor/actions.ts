"use server";

import { createClient } from "@/libs/supabase/server";

export interface Submission {
  id: string;
  team_name: string;
  github_url: string;
  project_title: string;
}

export async function fetchSubmissions(): Promise<Submission[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .select("id, team_name, github_url, project_title")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error);
    throw new Error(`Failed to fetch submissions: ${error.message}`);
  }

  return data || [];
}

export async function checkReadme(
  owner: string,
  repo: string
): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return false;
  }

  const readmePatterns = ["README.md", "README.rst", "README.txt", "readme.md"];

  try {
    for (const pattern of readmePatterns) {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${pattern}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.ok) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking README:", error);
    return false;
  }
}

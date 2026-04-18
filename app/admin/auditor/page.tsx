"use client";

import { AuditResponse } from "@/app/api/audit/route";
import { useAuth } from "@/app/providers/auth-provider";
import { useTheme } from "@/app/providers/theme-provider";
import { AuditResult, auditSubmission } from "@/libs/utils/audit";
import { useEffect, useState } from "react";
import { checkReadme, fetchSubmissions, Submission } from "./actions";
import { SubmissionCard } from "./submission-card";

interface AuditData {
  submission: Submission;
  auditResult: AuditResult | null;
  error: string | null;
  isLoading: boolean;
}

export default function AuditorPage() {
  const { profile, isLoading: authLoading } = useAuth();
  const { isLightMode } = useTheme();
  const [audits, setAudits] = useState<AuditData[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return;

      // Check if user is admin (organizer)
      if (!profile || profile.role !== "admin") {
        return;
      }

      try {
        const submissions = await fetchSubmissions();
        const auditDataArray: AuditData[] = submissions.map((sub) => ({
          submission: sub,
          auditResult: null,
          error: null,
          isLoading: true,
        }));
        setAudits(auditDataArray);

        // Audit each submission
        for (let i = 0; i < submissions.length; i++) {
          await auditOne(submissions[i], i);
        }
      } catch (error) {
        console.error("Error loading submissions:", error);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };

    loadData();
  }, [profile, authLoading]);

  const auditOne = async (submission: Submission, index: number) => {
    try {
      // Parse GitHub URL
      const urlMatch = submission.github_url.match(
        /github\.com[/:]([^/]+)\/([^/\s.]+)/i
      );
      if (!urlMatch) {
        setAudits((prev) => [
          ...prev.slice(0, index),
          {
            ...prev[index],
            error: "Invalid GitHub URL format",
            isLoading: false,
          },
          ...prev.slice(index + 1),
        ]);
        return;
      }

      const [, owner, repo] = urlMatch;

      // Call audit API
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAudits((prev) => [
          ...prev.slice(0, index),
          {
            ...prev[index],
            error: errorData.error || "Failed to audit repository",
            isLoading: false,
          },
          ...prev.slice(index + 1),
        ]);
        return;
      }

      const auditResponse: AuditResponse = await response.json();

      if (!auditResponse.success) {
        setAudits((prev) => [
          ...prev.slice(0, index),
          {
            ...prev[index],
            error: auditResponse.error || "Audit failed",
            isLoading: false,
          },
          ...prev.slice(index + 1),
        ]);
        return;
      }

      // Check for README
      const hasReadme = await checkReadme(owner, repo);

      // Perform audit
      const auditResult = auditSubmission(
        auditResponse.commits || [],
        auditResponse.contributors || [],
        auditResponse.repoData?.fork || false,
        hasReadme
      );

      setAudits((prev) => [
        ...prev.slice(0, index),
        {
          ...prev[index],
          auditResult,
          isLoading: false,
        },
        ...prev.slice(index + 1),
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setAudits((prev) => [
        ...prev.slice(0, index),
        {
          ...prev[index],
          error: errorMessage,
          isLoading: false,
        },
        ...prev.slice(index + 1),
      ]);
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div
        className={`relative min-h-screen font-sans transition-colors duration-500 ${isLightMode ? "bg-[#f5f5f5]" : "bg-black"
          }`}
      >
        <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-20 sm:px-6 lg:px-8 relative z-20">
          <div className="flex items-center justify-center py-20">
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${isLightMode ? "text-black/50" : "text-white/40"
                }`}
            >
              Loading...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Check authorization
  if (!profile || profile.role !== "admin") {
    return (
      <div
        className={`relative min-h-screen font-sans transition-colors duration-500 ${isLightMode ? "bg-[#f5f5f5]" : "bg-black"
          }`}
      >
        <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-20 sm:px-6 lg:px-8 relative z-20">
          <div className="flex flex-col items-center justify-center py-20 border-[3px] border-dashed border-white/20">
            <p className="text-white/50 text-sm font-bold uppercase tracking-widest">
              Organizer access required
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen font-sans transition-colors duration-500 mb-12 lg:mb-0 ${isLightMode ? "bg-[#f5f5f5]" : "bg-black"
        }`}
    >
      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-20 sm:px-6 lg:px-8 relative z-20">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className={`text-[10px] font-black uppercase tracking-[0.4em] ${isLightMode ? "text-black/55" : "text-white/50"
              }`}
          >
            Organizer Dashboard
          </p>
          <h1
            className={`mt-3 font-black uppercase tracking-tighter text-5xl sm:text-7xl ${isLightMode ? "text-black" : "text-white"
              }`}
          >
            Auditor
          </h1>
          <p className={`mt-4 text-sm ${isLightMode ? "text-black/60" : "text-white/60"}`}>
            Review and audit team submissions
          </p>
        </div>

        {/* Loading state for submissions */}
        {isLoadingSubmissions && audits.length === 0 ? (
          <div className="text-center py-12">
            <p className={isLightMode ? "text-black/50" : "text-white/50"}>
              Loading submissions...
            </p>
          </div>
        ) : audits.length === 0 ? (
          <div className="text-center py-12">
            <p className={isLightMode ? "text-black/50" : "text-white/50"}>
              No submissions found
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div
                className={`border-[2px] p-4 rounded-lg ${isLightMode
                    ? "border-black bg-white"
                    : "border-white/20 bg-[#111]"
                  }`}
              >
                <p className={`text-xs font-bold uppercase ${isLightMode ? "text-black/60" : "text-white/60"}`}>
                  Total Submissions
                </p>
                <p className={`text-3xl font-bold mt-2 ${isLightMode ? "text-black" : "text-white"}`}>
                  {audits.length}
                </p>
              </div>

              <div
                className={`border-[2px] p-4 rounded-lg ${isLightMode
                    ? "border-black bg-white"
                    : "border-white/20 bg-[#111]"
                  }`}
              >
                <p className={`text-xs font-bold uppercase ${isLightMode ? "text-black/60" : "text-white/60"}`}>
                  Clean
                </p>
                <p className="text-3xl font-bold mt-2 text-green-500">
                  {audits.filter((a) => a.auditResult?.verdict === "Clean").length}
                </p>
              </div>

              <div
                className={`border-[2px] p-4 rounded-lg ${isLightMode
                    ? "border-black bg-white"
                    : "border-white/20 bg-[#111]"
                  }`}
              >
                <p className={`text-xs font-bold uppercase ${isLightMode ? "text-black/60" : "text-white/60"}`}>
                  Suspicious
                </p>
                <p className="text-3xl font-bold mt-2 text-red-500">
                  {audits.filter((a) => a.auditResult?.verdict === "Suspicious").length}
                </p>
              </div>
            </div>

            {/* Submission Cards */}
            {audits.map((audit) => (
              <div key={audit.submission.id}>
                {audit.error ? (
                  <div
                    className={`border-[2px] p-6 rounded-lg ${isLightMode
                        ? "border-red-300 bg-red-50"
                        : "border-red-500/30 bg-red-500/10"
                      }`}
                  >
                    <p className="font-bold">{audit.submission.team_name}</p>
                    <p className="text-sm text-red-600 mt-2">{audit.error}</p>
                  </div>
                ) : audit.auditResult ? (
                  <SubmissionCard
                    teamName={audit.submission.team_name}
                    repoUrl={audit.submission.github_url}
                    auditResult={audit.auditResult}
                  />
                ) : (
                  <div
                    className={`border-[2px] p-6 rounded-lg ${isLightMode
                        ? "border-black bg-white"
                        : "border-white/20 bg-[#111]"
                      }`}
                  >
                    <p className="font-bold">{audit.submission.team_name}</p>
                    <p className={`text-sm mt-2 ${isLightMode ? "text-black/60" : "text-white/60"}`}>
                      Auditing...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

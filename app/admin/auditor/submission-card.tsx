"use client";

import { AuditResult } from "@/libs/utils/audit";
import { Card } from "@/ui/components/basic/card";
import { AlertCircle, AlertTriangle, CheckCircle, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SubmissionCardProps {
  teamName: string;
  repoUrl: string;
  auditResult: AuditResult;
  isLoading?: boolean;
}

const verdictConfig = {
  Clean: { color: "bg-green-500/20", textColor: "text-green-600", icon: CheckCircle, label: "Clean" },
  "Review Needed": { color: "bg-yellow-500/20", textColor: "text-yellow-600", icon: AlertTriangle, label: "Review Needed" },
  Suspicious: { color: "bg-red-500/20", textColor: "text-red-600", icon: AlertCircle, label: "Suspicious" },
};

export function SubmissionCard({ teamName, repoUrl, auditResult, isLoading }: SubmissionCardProps) {
  const verdict = auditResult.verdict;
  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <Card className="border-[2px] p-6 mb-6 dark:border-white/20 dark:bg-[#111]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{teamName}</h3>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {repoUrl}
            </a>
          </div>
          <div className={`px-3 py-1 rounded-full ${config.color} flex items-center gap-2`}>
            <Icon className="w-4 h-4" />
            <span className={`text-xs font-bold ${config.textColor}`}>{verdict}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading audit data...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Total Commits</p>
              <p className="text-2xl font-bold">{auditResult.stats.totalCommits}</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Contributors</p>
                <p className="text-2xl font-bold">{auditResult.stats.uniqueContributors}</p>
              </div>
            </div>
          </div>

          {/* Commit Frequency Chart */}
          {auditResult.stats.commitFrequency.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold mb-3">Commit Frequency</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={auditResult.stats.commitFrequency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.2)" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Contributor Breakdown */}
          {auditResult.stats.contributorBreakdown.length > 0 && (
            <div className="mb-6 pb-6 border-b border-white/10">
              <h4 className="text-sm font-bold mb-3">Top Contributors</h4>
              <div className="space-y-2">
                {auditResult.stats.contributorBreakdown.slice(0, 5).map((contributor) => (
                  <div key={contributor.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{contributor.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(contributor.commits /
                                Math.max(
                                  ...auditResult.stats.contributorBreakdown.map((c) => c.commits)
                                )) *
                              100
                              }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">{contributor.commits}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flags */}
          {auditResult.flags.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-3">Audit Flags</h4>
              <div className="space-y-2">
                {auditResult.flags.map((flag) => (
                  <div
                    key={flag.id}
                    className={`p-3 rounded border ${flag.severity === "critical"
                        ? "border-red-500/30 bg-red-500/10"
                        : "border-yellow-500/30 bg-yellow-500/10"
                      }`}
                  >
                    <p className={`text-sm font-bold ${flag.severity === "critical" ? "text-red-400" : "text-yellow-400"}`}>
                      {flag.title}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">{flag.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {auditResult.flags.length === 0 && (
            <div className="text-center py-4 text-green-400 text-sm">✓ No flags detected</div>
          )}
        </>
      )}
    </Card>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/libs/supabase/client";

export default function FeedbackDashboard() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    router.push("/login");
                    return;
                }

                // Check admin status
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("user_id", user.id)
                    .single();

                if (profile?.role !== "admin") {
                    router.push("/");
                    return;
                }

                setIsAdmin(true);
            } catch (error) {
                console.error("Error checking admin status:", error);
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [supabase, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-xl font-bold mb-4">Loading...</div>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-black uppercase tracking-wider text-white mb-8">
                    Feedback Dashboard
                </h1>

                <div className="border-[3px] border-[#c0ff00] bg-black/90 p-8 shadow-[8px_8px_0_#c0ff00] text-center">
                    <p className="text-white text-lg mb-6">
                        All feedback is stored directly in Google Sheets for easy access and analysis.
                    </p>

                    <a
                        href="https://docs.google.com/spreadsheets/d/1FC4Hnt2obWI1b5qd7F1JTuieS3f80WhqnqC4By4yPOU/edit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border-[3px] border-[#c0ff00] bg-[#c0ff00] text-black px-8 py-4 font-bold uppercase tracking-wider shadow-[6px_6px_0_#c0ff00] hover:-translate-y-1 transition-transform"
                    >
                        Open Google Sheet →
                    </a>

                    <p className="text-gray-400 text-sm mt-6">
                        You can view, filter, and export all feedback responses directly from the Google Sheet.
                    </p>
                </div>
            </div>
        </div>
    );
}
{
    stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
                { label: "Total Responses", value: stats.total, color: "bg-[#5ce1e6]" },
                { label: "Overall Rating", value: `${stats.avgOverall}/5`, color: "bg-[#c0ff00]" },
                { label: "Would Recommend", value: `${stats.recommendPercentage}%`, color: "bg-[#ff00a0]" },
                { label: "Return Next Year", value: `${stats.avgReturnLikelihood}/5`, color: "bg-[#ff6b35]" },
            ].map((stat, i) => (
                <div
                    key={i}
                    className={`border-[3px] border-white p-6 text-black shadow-[6px_6px_0_#c0ff00] ${stat.color}`}
                >
                    <p className="text-xs font-black uppercase tracking-wider mb-2">
                        {stat.label}
                    </p>
                    <p className="text-4xl font-black">{stat.value}</p>
                </div>
            ))}
        </div>
    )
}

{/* Category Ratings */ }
{
    stats && (
        <div className="border-[3px] border-white/30 bg-black p-8 mb-8 shadow-[6px_6px_0_#c0ff00]">
            <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-8">
                Category Ratings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { label: "Organization", value: stats.avgOrganization },
                    { label: "Venue & Facilities", value: stats.avgVenue },
                    { label: "Mentorship & Support", value: stats.avgMentorship },
                    { label: "Networking", value: stats.avgNetworking },
                    { label: "Food Arrangements", value: stats.avgFood },
                ].map((cat) => (
                    <div key={cat.label}>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-white font-bold uppercase text-sm">{cat.label}</p>
                            <p className="text-[#c0ff00] font-black text-lg">
                                {cat.value}/5
                            </p>
                        </div>
                        <div className="w-full bg-white/10 border-[2px] border-white/30 h-4">
                            <div
                                className="bg-gradient-to-r from-[#c0ff00] to-[#ff00a0] h-full"
                                style={{
                                    width: `${(parseFloat(cat.value) / 5) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t-[2px] border-white/30">
                <div>
                    <p className="text-gray-400 text-sm mb-2">Dietary Accommodations</p>
                    <p className="text-3xl font-black text-[#ff6b35]">
                        {stats.dietaryPercentage}%
                    </p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm mb-2">Sufficient Food Quantity</p>
                    <p className="text-3xl font-black text-[#5ce1e6]">
                        {stats.sufficientFoodPercentage}%
                    </p>
                </div>
            </div>
        </div>
    )
}

{/* Individual Feedback */ }
<div className="border-[3px] border-white/30 bg-black p-8 shadow-[6px_6px_0_#c0ff00]">
    <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-8">
        Individual Feedback
    </h2>
    <div className="space-y-6 max-h-[600px] overflow-y-auto">
        {feedback.map((item) => (
            <div
                key={item.id}
                className="border-[2px] border-white/30 bg-white/5 p-6 hover:bg-white/10 transition-all"
            >
                <div className="flex justify-between items-start mb-4 pb-4 border-b-[2px] border-white/20">
                    <div>
                        <p className="text-white font-black uppercase text-lg">
                            {item.name}
                        </p>
                        <p className="text-gray-400 text-sm font-semibold mb-1">
                            {item.email}
                        </p>
                        <p className="text-gray-400 text-xs font-semibold">
                            {new Date(item.created_at).toLocaleDateString()} at{" "}
                            {new Date(item.created_at).toLocaleTimeString()}
                        </p>
                    </div>
                    <p className="text-[#c0ff00] font-black text-2xl">
                        {item.overall_rating}/5
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {[
                        { label: "Organization", value: item.organization_rating },
                        { label: "Venue", value: item.venue_rating },
                        { label: "Mentorship", value: item.mentorship_rating },
                        { label: "Networking", value: item.networking_rating },
                        { label: "Food Arrangements", value: item.food_rating },
                        { label: "Dietary", value: item.dietary_options },
                        { label: "Quantity", value: item.food_quantity },
                        { label: "Recommend", value: item.would_recommend ? "Yes" : "No" },
                    ].map((field) => (
                        <div key={field.label}>
                            <span className="text-gray-400 text-xs font-bold uppercase">
                                {field.label}:
                            </span>
                            <p className="text-white font-bold">
                                {field.value}
                                {typeof field.value === "number" ? "/5" : ""}
                            </p>
                        </div>
                    ))}
                </div>

                {(item.highlights ||
                    item.additional_comments) && (
                        <div className="border-t-[2px] border-white/20 pt-4 space-y-3">
                            {item.highlights && (
                                <div>
                                    <p className="text-[#c0ff00] text-xs font-black uppercase mb-1">
                                        Highlights:
                                    </p>
                                    <p className="text-gray-200 text-sm">
                                        {item.highlights}
                                    </p>
                                </div>
                            )}
                            {item.additional_comments && (
                                <div>
                                    <p className="text-[#ff6b35] text-xs font-black uppercase mb-1">
                                        Comments:
                                    </p>
                                    <p className="text-gray-200 text-sm">
                                        {item.additional_comments}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
            </div>
        ))}
    </div>

    {feedback.length === 0 && (
        <p className="text-gray-400 text-center py-12 font-semibold">
            No feedback submitted yet
        </p>
    )}
</div>
        </div >
    </div >
);
}

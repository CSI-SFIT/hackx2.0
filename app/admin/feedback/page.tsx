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

"use client";

import FeedbackForm from "@/app/components/FeedbackForm";
import { useTheme } from "@/app/providers/theme-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FeedbackPage() {
    const { isLightMode } = useTheme();
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const handleSubmitFeedback = async (feedbackData: any) => {
        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(feedbackData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit feedback");
            }

            setSubmitted(true);
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (err) {
            console.error("Error submitting feedback:", err);
            alert("Error submitting feedback. Please try again.");
        }
    };

    return (
        <div
            className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isLightMode ? "bg-white" : "bg-black"
                }`}
        >
            {!isLightMode && (
                <div className="fixed inset-0 bg-black/60 pointer-events-none z-0" />
            )}

            <div className="max-w-2xl mx-auto relative z-10">
                <h1
                    className={`text-5xl font-black uppercase tracking-wider text-center mb-12 ${isLightMode ? "text-black" : "text-white"
                        }`}
                >
                    Share Your Feedback
                </h1>

                {submitted ? (
                    <div
                        className={`border-[3px] p-8 text-center ${isLightMode
                            ? "border-black bg-white text-black shadow-[8px_8px_0_#000]"
                            : "border-[#c0ff00] bg-black/90 text-white shadow-[8px_8px_0_#c0ff00]"
                            }`}
                    >
                        <h2 className="text-2xl font-black uppercase tracking-wider mb-2">
                            Thank You! 🎉
                        </h2>
                        <p className="text-lg mb-4">
                            Your feedback has been successfully submitted.
                        </p>
                        <p className={`text-sm ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
                            Redirecting you back home...
                        </p>
                    </div>
                ) : (
                    <FeedbackForm onSubmit={handleSubmitFeedback} />
                )}
            </div>
        </div>
    );
}

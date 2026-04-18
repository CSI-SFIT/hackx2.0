"use client";

import { useTheme } from "@/app/providers/theme-provider";
import { useState } from "react";
import { LoadingSpinner } from "./ui/loading-spinner";

interface FeedbackFormProps {
    onSubmit: (data: any) => Promise<void>;
    userEmail?: string;
}

export default function FeedbackForm({
    onSubmit,
    userEmail,
}: FeedbackFormProps) {
    const { isLightMode } = useTheme();
    const [formData, setFormData] = useState({
        name: "",
        email: userEmail || "",
        overall_rating: "5",
        organization_rating: "5",
        venue_rating: "5",
        mentorship_rating: "5",
        networking_rating: "5",
        food_rating: "5",
        would_recommend: "yes",
        return_next_year: "5",
        highlights: "",
        additional_comments: "",
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email.trim()) {
            alert("Please provide your email address");
            return;
        }

        setIsSaving(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSaving(false);
        }
    };

    const isSelected = (value: string, currentValue: string) => value === currentValue;

    const RatingScale = ({
        name,
        label,
        value,
    }: {
        name: string;
        label: string;
        value: string;
    }) => (
        <div className="mb-8">
            <label className={`block text-sm font-bold uppercase tracking-wider mb-4 ${isLightMode ? "text-black" : "text-white"
                }`}>
                {label}
            </label>
            <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        type="button"
                        onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                [name]: num.toString(),
                            }))
                        }
                        className={`w-14 h-14 border-[3px] font-black text-lg transition-all hover:-translate-y-1 ${isSelected(num.toString(), value)
                            ? isLightMode
                                ? "border-black bg-[#c0ff00] text-black shadow-[6px_6px_0_#000]"
                                : "border-white bg-[#c0ff00] text-black shadow-[6px_6px_0_#c0ff00]"
                            : isLightMode
                                ? "border-black bg-white text-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]"
                                : "border-white/40 bg-white/5 text-white shadow-[4px_4px_0_#fff] hover:shadow-[6px_6px_0_#fff]"
                            }`}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <div className={`flex justify-between text-xs font-semibold mt-2 ${isLightMode ? "text-gray-600" : "text-gray-300"
                }`}>
                <span>Poor</span>
                <span>Excellent</span>
            </div>
        </div>
    );

    return (
        <form
            onSubmit={handleSubmit}
            className={`border-[3px] p-8 transition-all backdrop-blur-sm ${isLightMode
                ? "border-black bg-white shadow-[8px_8px_0_#000]"
                : "border-[#c0ff00] bg-black/90 shadow-[8px_8px_0_#c0ff00]"
                }`}
        >
            <div className="flex flex-col gap-8">
                {/* Name */}
                <div>
                    <label htmlFor="name" className={`block text-xs font-black uppercase tracking-widest mb-3 ${isLightMode ? "text-black" : "text-white"
                        }`}>
                        Name *
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className={`w-full px-4 py-3 border-[2px] font-medium text-sm transition-all focus:outline-none ${isLightMode
                            ? "border-black bg-white text-black placeholder-gray-500 focus:shadow-[4px_4px_0_#000]"
                            : "border-[#c0ff00] bg-white/10 text-white placeholder-gray-300 focus:shadow-[4px_4px_0_#c0ff00] focus:border-[#c0ff00]"
                            }`}
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className={`block text-xs font-black uppercase tracking-widest mb-3 ${isLightMode ? "text-black" : "text-white"
                        }`}>
                        Email Address *
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                        className={`w-full px-4 py-3 border-[2px] font-medium text-sm transition-all focus:outline-none ${isLightMode
                            ? "border-black bg-white text-black placeholder-gray-500 focus:shadow-[4px_4px_0_#000]"
                            : "border-[#c0ff00] bg-white/10 text-white placeholder-gray-300 focus:shadow-[4px_4px_0_#c0ff00] focus:border-[#c0ff00]"
                            }`}
                    />
                </div>

                {/* Rating Scales */}
                <div>
                    <h3 className={`text-lg font-black uppercase tracking-wider mb-8 ${isLightMode ? "text-black" : "text-white"
                        }`}>
                        Please rate your experience
                    </h3>

                    <RatingScale
                        name="organization_rating"
                        label="Organization & Event Management"
                        value={formData.organization_rating}
                    />

                    <RatingScale
                        name="venue_rating"
                        label="Venue & Infrastructure"
                        value={formData.venue_rating}
                    />

                    <RatingScale
                        name="mentorship_rating"
                        label="Mentorship & Support Quality"
                        value={formData.mentorship_rating}
                    />

                    <RatingScale
                        name="networking_rating"
                        label="Networking Opportunities"
                        value={formData.networking_rating}
                    />

                    <RatingScale
                        name="food_rating"
                        label="Food Arrangements"
                        value={formData.food_rating}
                    />
                </div>

                {/* Binary Questions & Options */}
                <div className="space-y-8">
                    <div>
                        <RatingScale
                            name="return_next_year"
                            label="Likelihood to participate next year"
                            value={formData.return_next_year}
                        />
                    </div>

                    <div>
                        <RatingScale
                            name="overall_rating"
                            label="Overall Event Experience"
                            value={formData.overall_rating}
                        />
                    </div>
                </div>

                {/* Open Feedback */}
                <div className="space-y-8">
                    <div>
                        <label htmlFor="highlights" className={`block text-xs font-black uppercase tracking-widest mb-3 ${isLightMode ? "text-black" : "text-white"
                            }`}>
                            What were the highlights of the event?
                        </label>
                        <textarea
                            id="highlights"
                            name="highlights"
                            value={formData.highlights}
                            onChange={handleChange}
                            placeholder="Share your favorite moments, talks, or connections..."
                            rows={4}
                            className={`w-full px-4 py-3 border-[2px] font-medium text-sm resize-none transition-all focus:outline-none ${isLightMode
                                ? "border-black bg-white text-black placeholder-gray-500 focus:shadow-[4px_4px_0_#000]"
                                : "border-white/40 bg-white/5 text-white placeholder-gray-400 focus:shadow-[4px_4px_0_#c0ff00] focus:border-white"
                                }`}
                        />
                    </div>

                    <div>
                        <label htmlFor="additional_comments" className={`block text-xs font-black uppercase tracking-widest mb-3 ${isLightMode ? "text-black" : "text-white"
                            }`}>
                            Additional Comments
                        </label>
                        <textarea
                            id="additional_comments"
                            name="additional_comments"
                            value={formData.additional_comments}
                            onChange={handleChange}
                            placeholder="Anything else you'd like to share..."
                            rows={4}
                            className={`w-full px-4 py-3 border-[2px] font-medium text-sm resize-none transition-all focus:outline-none ${isLightMode
                                ? "border-black bg-white text-black placeholder-gray-500 focus:shadow-[4px_4px_0_#000]"
                                : "border-white/40 bg-white/5 text-white placeholder-gray-400 focus:shadow-[4px_4px_0_#c0ff00] focus:border-white"
                                }`}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSaving}
                    className={`relative flex items-center justify-center gap-3 border-[3px] px-6 py-4 text-xs font-black uppercase tracking-[0.15em] transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${isLightMode
                        ? "border-black bg-[#c0ff00] text-black shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#000]"
                        : "border-[#c0ff00] bg-[#c0ff00] text-black shadow-[6px_6px_0_#c0ff00] hover:shadow-[8px_8px_0_#c0ff00]"
                        }`}
                >
                    {isSaving && <LoadingSpinner size="sm" />}
                    {isSaving ? "Submitting..." : "Submit Feedback"}
                </button>

                <p className={`text-xs font-semibold text-center ${isLightMode ? "text-gray-600" : "text-gray-200"
                    }`}>
                    Thank you for helping us improve! Your feedback is valuable to us.
                </p>
            </div>
        </form>
    );
}

import { appendFeedbackToSheet } from "@/libs/google-sheets";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Save directly to Google Sheets only
        await appendFeedbackToSheet({
            name: body.name,
            email: body.email,
            overall_rating: parseInt(body.overall_rating),
            organization_rating: parseInt(body.organization_rating),
            venue_rating: parseInt(body.venue_rating),
            mentorship_rating: parseInt(body.mentorship_rating),
            networking_rating: parseInt(body.networking_rating),
            food_rating: parseInt(body.food_rating),
            would_recommend: body.would_recommend === "yes" || body.would_recommend === true,
            return_next_year: parseInt(body.return_next_year),
            highlights: body.highlights,
            additional_comments: body.additional_comments,
            submitted_at: new Date().toISOString(),
        });

        return NextResponse.json(
            { message: "Feedback submitted successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return NextResponse.json(
            { error: "Failed to submit feedback" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.json(
        {
            message: "Feedback data is stored in Google Sheets. Access it directly from your Google Drive.",
            sheetUrl: "https://docs.google.com/spreadsheets/d/1FC4Hnt2obWI1b5qd7F1JTuieS3f80WhqnqC4By4yPOU/edit"
        },
        { status: 200 }
    );
}

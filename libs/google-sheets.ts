import { google } from "googleapis";

const sheets = google.sheets("v4");

// Initialize the Google Sheets auth
const getAuthClient = () => {
    const credentials = {
        type: "service_account",
        project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
        private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.GOOGLE_SHEETS_CLIENT_CERT_URL,
    };

    return new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
};

export interface FeedbackData {
    name: string;
    email: string;
    overall_rating: number;
    organization_rating: number;
    venue_rating: number;
    mentorship_rating: number;
    networking_rating: number;
    food_rating: number;
    would_recommend: boolean;
    return_next_year: number;
    highlights: string;
    additional_comments: string;
    submitted_at: string;
}

export async function appendFeedbackToSheet(feedback: FeedbackData) {
    try {
        const auth = getAuthClient();
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

        if (!spreadsheetId) {
            throw new Error("GOOGLE_SHEETS_ID environment variable not set");
        }

        const values = [
            [
                feedback.submitted_at,
                feedback.name,
                feedback.email,
                feedback.overall_rating,
                feedback.organization_rating,
                feedback.venue_rating,
                feedback.mentorship_rating,
                feedback.networking_rating,
                feedback.food_rating,
                feedback.would_recommend ? "Yes" : "No",
                feedback.return_next_year,
                feedback.highlights,
                feedback.additional_comments,
            ],
        ];

        const response = await sheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Sheet1!A:M",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error appending to Google Sheets:", error);
        throw error;
    }
}

export async function initializeSheet() {
    try {
        const auth = getAuthClient();
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

        if (!spreadsheetId) {
            throw new Error("GOOGLE_SHEETS_ID environment variable not set");
        }

        // Check if headers exist
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Sheet1!A1:M1",
        });

        // If no headers, add them
        if (!response.data.values || response.data.values.length === 0) {
            const headers = [
                [
                    "Submitted At",
                    "Name",
                    "Email",
                    "Overall Rating",
                    "Organization Rating",
                    "Venue Rating",
                    "Mentorship Rating",
                    "Networking Rating",
                    "Food Rating",
                    "Would Recommend",
                    "Return Next Year",
                    "Highlights",
                    "Additional Comments",
                ],
            ];

            await sheets.spreadsheets.values.update({
                auth,
                spreadsheetId,
                range: "Sheet1!A1:M1",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: headers,
                },
            });
        }
    } catch (error) {
        console.error("Error initializing Google Sheet:", error);
        throw error;
    }
}

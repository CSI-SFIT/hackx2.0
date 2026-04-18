import argparse
import os
import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import pandas as pd


# ── Gmail SMTP Configuration ──────────────────────────────────────────────────
GMAIL_ADDRESS = "csi@sfit.ac.in"
GMAIL_APP_PASSWORD = "bgzy okal adrs kktx"
EMAIL_SUBJECT = "Your HackX 2.0 Credentials - CSI SFIT"
TEST_EMAIL_SUBJECT = "Test mail from CSI SFIT"


def build_plain_message(name: str, email: str, password: str, team_name: str) -> str:
    return (
        f"Hello {name},\n\n"
        f"Your login details for HackX 2.0 are ready.\n"
        f"Team Name: {team_name}\n"
        f"Login ID: {email}\n"
        f"Login Password: {password}\n\n"
        f"Please keep these credentials safe and do not share them.\n\n"
        f"Regards,\n"
        f"Team CSI SFIT"
    )


def build_html_message(name: str, email: str, password: str, team_name: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>HackX 2.0 Credentials</title>
    </head>
    <body style="margin:0; padding:0; background:#f0f4f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:#1f2a44;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f0f4f9; padding:32px 16px;">
            <tr>
                <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(15,23,42,0.12);">
                        <tr>
                            <td style="padding:0;">
                                <div style="height:8px; background:linear-gradient(90deg, #ef4444 0%, #f97316 25%, #2563eb 50%, #7c3aed 75%, #ec4899 100%);"></div>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding:40px 32px 24px 32px; background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
                                <img src="/public/hackx-black.png" alt="HackX 2.0 Logo" style="max-width:200px; height:auto; margin:0 auto 24px auto; display:block;" />
                                <div style="font-size:42px; line-height:1; font-weight:900; color:#0f172a; margin:0 0 8px 0; letter-spacing:-1px;">HackX 2.0</div>
                                <div style="font-size:18px; line-height:1.4; color:#2563eb; max-width:520px; margin:0 auto 16px auto; font-weight:600; letter-spacing:0.5px;">The Spider-Verse Edition</div>
                                <div style="font-size:14px; line-height:1.8; color:#64748b; max-width:520px; margin:0 auto 20px auto; font-weight:500;">
                                    Welcome to the web of innovation, teamwork, and high-energy problem solving.
                                </div>
                                <div style="width:80px; height:3px; margin:0 auto; background:linear-gradient(90deg, #ef4444 0%, #2563eb 100%); border-radius:999px;"></div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 32px 0 32px; font-size:15px; line-height:1.8; color:#334155;">
                                <p style="margin:0 0 4px 0; font-size:20px; font-weight:700; color:#0f172a;">Hello {name},</p>
                                <p style="margin:0 0 20px 0; font-size:15px; color:#475569;">Your login details for <strong>HackX 2.0</strong> are ready. Secure them carefully!</p>
                                <div style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#ffffff; border-radius:12px; padding:16px 18px; font-size:14px; line-height:1.7; margin:0 0 20px 0; border-left:4px solid #ef4444;">
                                    <strong style="color:#fecaca; display:block; margin-bottom:6px;">⚠ Important Security Notice</strong>
                                    These credentials are unique to each member and must not be shared inside or outside the team. Keep them confidential.
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0 32px;">
                                <div style="border:2px solid #e2e8f0; border-radius:12px; background:#f8fafc; padding:18px; margin:0 0 20px 0;">
                                    <div style="font-size:15px; color:#0f172a; margin:0 0 12px 0; font-weight:600;"><strong>Team Name:</strong> <span style="color:#475569; font-weight:500;">{team_name}</span></div>
                                    <div style="font-size:15px; color:#0f172a; margin:0 0 12px 0; font-weight:600;"><strong>Login ID:</strong> <span style="color:#2563eb; font-weight:500; font-family:'Courier New', monospace; background:#eff6ff; padding:3px 8px; border-radius:4px; font-size:14px;">{email}</span></div>
                                    <div style="font-size:15px; color:#0f172a; margin:0; font-weight:600;"><strong>Login Password:</strong> <span style="background:linear-gradient(135deg, #fef08a 0%, #fde047 100%); color:#0f172a; padding:4px 10px; border-radius:6px; font-family:'Courier New', monospace; font-weight:600; font-size:14px;">{password}</span></div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0 32px;">
                                <div style="border:2px solid #e2e8f0; border-radius:12px; background:#ffffff; padding:18px; margin:0 0 20px 0;">
                                    <div style="font-size:16px; line-height:1.9; color:#0f172a;">
                                        <div style="margin:0 0 12px 0;">
                                            <a href="https://hackx2-0.vercel.app/login" style="color:#ffffff; text-decoration:none; font-weight:700; background:linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding:12px 24px; border-radius:8px; display:inline-block; font-size:15px;">Access HackX 2.0 Login Portal</a>
                                        </div>
                                        <div style="font-size:13px; color:#64748b; line-height:1.6; margin-top:8px;">Click the button above to log in with your credentials.</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0 32px 20px 32px; font-size:14px; line-height:1.8; color:#475569;">
                                <p style="margin:0 0 12px 0;"><strong style="color:#0f172a;">Explore HackX 2.0 on our website</strong> - Code for Bharat 5.0 is a hackathon celebrating innovation, teamwork, and high-energy problem-solving. Visit us to learn more about the event, problem statements, timeline, and how to register your team!</p>
                                <p style="margin:0; color:#ef4444; font-weight:700; font-size:15px;">Please keep these details safe and use them only for your own access.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:20px 32px 28px 32px; font-size:13px; color:#94a3b8; line-height:1.8; border-top:1px solid #e2e8f0; background:#f8fafc;">
                                Best Regards,<br />
                                <strong style="color:#0f172a;">Team CSI SFIT</strong><br />
                                <span style="font-size:12px; color:#cbd5e1;">Symbiosis Institute of Technology</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>"""


def build_test_plain_message() -> str:
    return (
        "This is a test email from the CSI SFIT credential sender script.\n\n"
        "If you received this, SMTP login and delivery are working."
    )


def build_test_html_message() -> str:
    return """<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Test Mail</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#1f2a44;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb; padding:24px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(27,39,61,0.10);">
                        <tr>
                            <td style="padding:0;"><div style="height:6px; background:linear-gradient(90deg, #ef4444 0%, #f59e0b 25%, #f8fafc 50%, #2563eb 75%, #7c3aed 100%);"></div></td>
                        </tr>
                        <tr>
                            <td style="padding:36px 28px; text-align:center;">
                                <div style="font-size:28px; font-weight:800; margin:0 0 8px 0;">Test Mail</div>
                                <div style="font-size:14px; line-height:1.7; color:#64748b;">This preview confirms SMTP login and email delivery are working.</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>"""


def send_message(smtp: smtplib.SMTP, to_address: str, subject: str, plain_body: str, html_body: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = GMAIL_ADDRESS
    msg["To"] = to_address
    msg.attach(MIMEText(plain_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))
    smtp.sendmail(GMAIL_ADDRESS, to_address, msg.as_string())


def main(csv_path: str):
    if not os.path.exists(csv_path):
        print(f"[ERROR] File not found: {csv_path}")
        sys.exit(1)

    print(f"[INFO] Loading CSV: {csv_path}")
    df = pd.read_csv(csv_path)
    print(f"[INFO] Total rows loaded: {len(df)}")
    print(f"[INFO] Columns detected : {list(df.columns)}")

    required = ["Name", "Email", "Password", "Team Name"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        print(f"[ERROR] Missing columns: {missing}")
        sys.exit(1)

    df = df[required].dropna()
    print(f"[INFO] Rows after dropping blanks: {len(df)}")

    print("\n[INFO] Connecting to Gmail SMTP...")
    sent_count = 0
    fail_count = 0

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            print("[INFO] Login successful. Sending emails...\n")

            for _, row in df.iterrows():
                name = str(row["Name"]).strip()
                email = str(row["Email"]).strip()
                password = str(row["Password"]).strip()
                team_name = str(row["Team Name"]).strip()

                plain_body = build_plain_message(name, email, password, team_name)
                html_body = build_html_message(name, email, password, team_name)

                try:
                    send_message(smtp, email, EMAIL_SUBJECT,
                                 plain_body, html_body)
                    print(f"  [OK] Sent -> {email} ({name})")
                    sent_count += 1
                except Exception as e:
                    print(f"  [FAIL] {email} | Reason: {e}")
                    fail_count += 1

    except smtplib.SMTPAuthenticationError:
        print("\n[ERROR] Authentication failed.")
        print("        Make sure you're using a Gmail App Password, not your regular password.")
        print("        Guide: https://support.google.com/accounts/answer/185833")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] SMTP connection failed: {e}")
        sys.exit(1)

    print("\n── Summary ──────────────────────────────────────")
    print(f"  Total rows   : {len(df)}")
    print(f"  Emails sent  : {sent_count}")
    print(f"  Failures     : {fail_count}")
    print("─────────────────────────────────────────────────")


def send_self_test(recipient: str):
    print("[INFO] Sending test email...")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            send_message(
                smtp,
                recipient,
                TEST_EMAIL_SUBJECT,
                build_test_plain_message(),
                build_test_html_message(),
            )
            print(f"[INFO] Test email sent to {recipient}")

    except smtplib.SMTPAuthenticationError:
        print("\n[ERROR] Authentication failed.")
        print("        Make sure you're using a Gmail App Password, not your regular password.")
        print("        Guide: https://support.google.com/accounts/answer/185833")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] SMTP connection failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Send credential emails or a single test email.")
    parser.add_argument("csv_path", nargs="?",
                        help="Path to the CSV file with Name, Email, Password columns.")
    parser.add_argument("--test-email", dest="test_email",
                        help="Send a single test email to this address.")

    args = parser.parse_args()

    if args.test_email:
        send_self_test(args.test_email)
        sys.exit(0)

    if not args.csv_path:
        print("Usage : python send_credentials.py <input.csv>")
        print("   or : python send_credentials.py --test-email your.address@example.com")
        sys.exit(1)

    main(args.csv_path)

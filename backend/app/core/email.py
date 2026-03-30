import resend
from backend.app.config.settings import settings

resend.api_key = settings.RESEND_API_KEY


def send_verification_email(to_email: str, username: str, token: str):

    verify_url = f"https://capstone-project-1dwj.onrender.com/auth/verify-email?token={token}"

    params = {
        "from": "UNCG Market <noreply@geniem.art>",
        "to": [to_email],
        "subject": "Verify your UNCG Market account",
        "html": f"""
        <h2>Welcome {username}</h2>
        <p>Click below to verify your email:</p>
        <a href="{verify_url}">Verify Email</a>
        """
    }

    resend.Emails.send(params)
import boto3
from botocore.client import Config

from backend.app.config.settings import settings


s3_client = boto3.client(
    "s3",
    endpoint_url=f"https://{settings.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com",
    aws_access_key_id=settings.R2_ACCESS_KEY,
    aws_secret_access_key=settings.R2_SECRET_KEY,
    config=Config(signature_version="s3v4"),
    region_name="auto",
)
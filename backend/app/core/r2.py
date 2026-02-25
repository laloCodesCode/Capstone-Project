import boto3
from botocore.client import Config
from .config import CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET_NAME

s3_client = boto3.client(
    "s3",
    endpoint_url=f"https://b005020a5dbafb3993e9479bb4d48638.r2.cloudflarestorage.com",
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
    config=Config(signature_version="s3v4"),
    region_name="auto",
)
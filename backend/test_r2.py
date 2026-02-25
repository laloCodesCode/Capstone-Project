import boto3
from botocore.client import Config
import os
from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client(
    "s3",
    endpoint_url=f"https://b005020a5dbafb3993e9479bb4d48638.r2.cloudflarestorage.com",
    aws_access_key_id=os.getenv("R2_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("R2_SECRET_KEY"),
    config=Config(signature_version="s3v4"),
    region_name="auto",
)
try:
    s3.put_object(
        Bucket=os.getenv("R2_BUCKET_NAME"),
        Key="test.txt",
        Body=b"Hello from FastAPI",
    )
    print("Upload successful!")
except Exception as e:
    print("Upload failed")
    print(e)
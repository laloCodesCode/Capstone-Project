from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    NEON_CONNECTION_STRING: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    SECRET_KEY: str
    ALGORITHM: str
    RESEND_API_KEY: str

    R2_ACCESS_KEY: str
    R2_SECRET_KEY: str
    R2_BUCKET_NAME: str
    CLOUDFLARE_ACCOUNT_ID: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
from pydantic import BaseModel


class  MessageCreate(BaseModel):
    body: str
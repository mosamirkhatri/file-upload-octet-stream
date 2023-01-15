from typing import Optional
# Library Imports
from pydantic import BaseModel

class UploadChunk(BaseModel):
    chunk: str
    file_name: str
    folder: Optional[str]

class UploadComplete(BaseModel):
    file_name: str
    folder: str

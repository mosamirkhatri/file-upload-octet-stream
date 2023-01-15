import os, base64, uuid
# Library Imports
from fastapi import APIRouter
# Local Imports
from ..core.schemas import UploadChunk, UploadComplete

router = APIRouter(prefix="/api")

@router.get('/')
@router.get('/router-test')
def router_test():
    return "Router Testing"

@router.post('/upload-chunk')
def upload_chunk(file: UploadChunk):
    folder = str(uuid.uuid4()) if file.folder is None else file.folder
    if not os.path.exists(upload_dir := os.path.join('uploads', folder)):
        os.makedirs(upload_dir)
    encoded_file = os.path.join(upload_dir, f"{file.file_name}.txt")
    mode = 'a'
    with open(encoded_file, mode) as file_object:
        file_object.write(file.chunk)
    return {"success": True, "message": "Chunk Uploaded", "folder": folder}

@router.post('/upload-chunk-octet-stream')
def upload_chunk(file: UploadChunk):
    folder = str(uuid.uuid4()) if file.folder is None else file.folder
    if not os.path.exists(upload_dir := os.path.join('uploads', folder)):
        os.makedirs(upload_dir)
    out_file = os.path.join(upload_dir, file.file_name)
    mode = 'ab' if os.path.isfile(out_file) else 'wb'
    with open(out_file, mode) as file_object:
        file_object.write(bytearray(base64.b64decode(file.chunk)))
    return {"success": True, "message": "Chunk Uploaded", "folder": folder}

@router.post('/upload-complete')
def upload_complete(file: UploadComplete):
    upload_dir = os.path.join('uploads', file.folder)
    encoded_file = os.path.join(upload_dir, f"{file.file_name}.txt")
    actual_file = os.path.join(upload_dir, f"{file.file_name}")
    with open(encoded_file) as txt_file_object:
        file_contents = txt_file_object.read()
        decoded_content = base64.b64decode(file_contents)
        with open(actual_file, "wb") as actual_file_object:
            actual_file_object.write(decoded_content)
    if os.path.exists(encoded_file):
        os.remove(encoded_file)
    return {"success": True, "message": "Upload Complete"}
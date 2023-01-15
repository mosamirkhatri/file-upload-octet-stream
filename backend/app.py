from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.upload import router
import uvicorn

app = FastAPI(debug=True)

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(router)

@app.get('/')
@app.get('/health')
def health():
    return "working"

if __name__ == "__main__":
    uvicorn.run("app:app", reload=True)
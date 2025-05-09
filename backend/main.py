from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import yt_dlp
import os
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_DIR = str(Path.home() / "Downloads")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

class DownloadRequest(BaseModel):
    url: str

@app.options("/download")
async def options_download():
    return Response(status_code=200)

@app.post("/download")
async def download_video(request: DownloadRequest):
    ydl_opts = {
        'format': 'bv[ext=mp4][vcodec^=avc1]+ba[ext=m4a]/best[ext=mp4]',
        'outtmpl': f'{DOWNLOAD_DIR}/%(title)s.%(ext)s',
        'merge_output_format': 'mp4',
        'overwrites': True,
        'quiet': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=True)
            filename = ydl.prepare_filename(info)

        return FileResponse(filename, media_type="video/mp4", filename=os.path.basename(filename))

    except Exception as e:
        return {"status": "error", "message": str(e)}

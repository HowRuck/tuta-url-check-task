import random
from contextlib import asynccontextmanager
from enum import Enum

import granian
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from granian.constants import Interfaces
from granian.log import logger
from pydantic import BaseModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.client = httpx.AsyncClient(
        timeout=httpx.Timeout(5.0),
        follow_redirects=True,
    )
    logger.info("HTTP client initialized")

    yield

    # Shutdown
    await app.state.client.aclose()
    logger.info("HTTP client closed")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class CheckRequestModel(BaseModel):
    url: str


class FileType(str, Enum):
    FILE = "FILE"
    DIRECTORY = "DIR"

    @classmethod
    def get_random(cls) -> FileType:
        return random.choice(list(cls))


class CheckRequestResponseModel(BaseModel):
    url: str
    status: int
    type: FileType


@app.post("/check")
async def check_url(payload: CheckRequestModel) -> CheckRequestResponseModel:
    logger.info("Received request to check URL: %s", payload.url)

    client: httpx.AsyncClient = app.state.client

    try:
        fetch_response = await client.get(
            payload.url, timeout=5.0, follow_redirects=True
        )

        logger.info(
            "Fetched URL %s with status %s",
            payload.url,
            fetch_response.status_code,
        )

        file_type = FileType.get_random()

        response = CheckRequestResponseModel(
            url=payload.url, status=fetch_response.status_code, type=file_type
        )

        return response

    except httpx.TimeoutException:
        logger.warning("Timeout while fetching URL: %s", payload.url)

        raise HTTPException(status_code=504, detail="Request Timed Out")
    except httpx.RequestError as e:
        logger.error(
            "Request error for URL %s: %s",
            payload.url,
            str(e),
        )
        raise HTTPException(status_code=502, detail="Request Failed")


def run_server():
    granian.Granian(
        "main:app", address="127.0.0.1", port=3001, interface=Interfaces.ASGI
    ).serve()


if __name__ == "__main__":
    run_server()

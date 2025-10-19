from fastapi import FastAPI
from contextlib import asynccontextmanager
from orbitium.config import settings
from orbitium.api.main import router_v1
from orbitium.db.main import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

@app.get("/")
async def root():
    return {"message": "app working :)!!"}

app.include_router(router_v1)
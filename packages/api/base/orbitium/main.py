from fastapi import FastAPI
from orbitium.config import settings
from orbitium.api.main import router_v1

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.get("/")
async def root():
    return {"message": "app working :)!!"}

app.include_router(router_v1)
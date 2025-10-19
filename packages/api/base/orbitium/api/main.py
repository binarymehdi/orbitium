from fastapi import APIRouter
from orbitium.config import settings
from orbitium.api.v1 import flows

router_v1 = APIRouter(prefix=settings.API_V1_STR)


@router_v1.get("/health-check")
async def health_check() -> bool:
    return True


router_v1.include_router(flows.router)

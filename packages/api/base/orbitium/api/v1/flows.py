from fastapi import APIRouter
from uuid import UUID

from orbitium.db.main import SessionDep

router = APIRouter(prefix="/flows", tags=["flows"])


# get flow from database
@router.get("/{id}")
async def get_flow_by_id(id: UUID, session: SessionDep) -> dict[str, str]:
    return {"msg": f" getting workflow of id={id}"}


@router.post("/initialize-flow")
async def initialize_flow(session: SessionDep) -> None:
    """
    initializes an empty flow,
    returns it's id, and redirects
    the user to start editing.
    """
    return


@router.put("/{id}")
async def edit_flow(id: UUID, session: SessionDep) -> None:
    """
    for now, each time the user makes a change,
    this endpoint is triggered to reconsile the 
    server state with the ui state.
    """
    pass


@router.delete("/{id}")
async def delete_flow(id: UUID, session: SessionDep) -> None:
    """delete flow, not important rn"""
    pass

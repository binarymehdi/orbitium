from fastapi import APIRouter, HTTPException
from uuid import UUID
from typing import List

from orbitium.db.main import SessionDep
from orbitium.db.models import Flow, FlowRead

from sqlmodel import select


router = APIRouter(prefix="/flows", tags=["flows"])


@router.get("/", response_model=List[FlowRead])
async def get_flows(session: SessionDep) -> List[Flow]:
    statement = select(Flow)
    result = session.exec(statement)
    return list(result)


@router.get("/{id}", response_model=FlowRead)
async def get_flow_by_id(id: UUID, session: SessionDep) -> Flow | None:

    statement = select(Flow).where(Flow.id == id)
    flow = session.exec(statement).first()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flow


@router.post("/create-flow")
async def create_flow(session: SessionDep) -> None:
    """
    initializes an empty flow,
    returns it's id to redirects
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

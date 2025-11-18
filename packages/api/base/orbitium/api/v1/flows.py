from fastapi import APIRouter, HTTPException
from uuid import UUID
from typing import List, Dict

from orbitium.db.main import SessionDep
from orbitium.db.models import FlowBase, Flow, FlowRead, FlowUpdate

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


@router.post("/create-flow", response_model=FlowRead)
async def create_flow(flow_data: FlowBase, session: SessionDep) -> Flow:
    
    flow = Flow.model_validate(flow_data)
    session.add(flow)
    session.commit()
    session.refresh(flow)
    
    return flow




@router.put("/{id}/edit", response_model=FlowRead)
async def edit_flow(id: UUID, flowData: FlowUpdate, session: SessionDep) -> Flow:
    """
    for now, each time the user makes a change,
    this endpoint is triggered to reconsile the 
    server state with the ui state, should also take into consideration the node position
    """
    statement = select(Flow).where(Flow.id == id)
    flow = session.exec(statement).first()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    # Update flow fields
    flow_data = flowData.model_dump(exclude_unset=True)
    for key, value in flow_data.items():
        setattr(flow, key, value)
    
    session.add(flow)
    session.commit()
    session.refresh(flow)
    
    return flow



# CORE PART OF CAPSTONE
@router.get("/{id}/execute")
async def execute_flow(id: UUID, session: SessionDep) -> None:
     
    pass




@router.delete("/{id}")
async def delete_flow(id: UUID, session: SessionDep) -> Dict[str, str]:
    """Delete a flow by ID"""
    statement = select(Flow).where(Flow.id == id)
    flow = session.exec(statement).first()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    session.delete(flow)
    session.commit()
    
    return {"message": "Flow deleted successfully"}

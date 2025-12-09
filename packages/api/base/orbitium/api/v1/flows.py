from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from uuid import UUID
from typing import List, Dict, Any, AsyncGenerator
import subprocess
import tempfile
import json
import os
import asyncio

from orbitium.db.main import SessionDep, get_db
from orbitium.db.models import FlowBase, Flow, FlowRead, FlowUpdate

from sqlmodel import select

ENGINE_PATH = os.environ.get("ENGINE_PATH", os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..", "engine"))

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



@router.get("/{id}/execute/stream")
async def execute_flow_stream(id: UUID):
    session = next(get_db())
    try:
        statement = select(Flow).where(Flow.id == id)
        flow = session.exec(statement).first()
        
        if not flow:
            raise HTTPException(status_code=404, detail="Flow not found")
        
        if not flow.data or not flow.data.get("nodes"):
            raise HTTPException(status_code=400, detail="Flow has no nodes to execute")
        
        flow_data = flow.data
    finally:
        session.close()
    
    async def event_generator() -> AsyncGenerator[str, None]:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(flow_data, f)
            pipeline_path = f.name
        
        try:
            engine_binary = os.path.join(ENGINE_PATH, "engine.exe") if os.name == 'nt' else os.path.join(ENGINE_PATH, "engine")
            
            process = subprocess.Popen(
                [engine_binary, pipeline_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=ENGINE_PATH,
                text=True,
                bufsize=1
            )
            
            import select as sel
            import sys
            
            done_received = False
            
            # Read stderr line by line for status updates
            while process.poll() is None:
                line = process.stderr.readline()
                if line:
                    if line.startswith("STATUS:"):
                        status_json = line[7:].strip()
                        yield f"data: {status_json}\n\n"
                        
                        # Check if this is the "done" status - send output immediately
                        try:
                            status_data = json.loads(status_json)
                            if status_data.get("status") == "done":
                                done_received = True
                                # Read data_flow.txt immediately (it's already finalized)
                                data_flow_path = os.path.join(ENGINE_PATH, "data_flow.txt")
                                data_flow_content = ""
                                if os.path.exists(data_flow_path):
                                    with open(data_flow_path, 'r', encoding='utf-8', errors='ignore') as f:
                                        data_flow_content = f.read()
                                
                                final_data = json.dumps({
                                    "status": "finished",
                                    "success": True,
                                    "data_flow": data_flow_content
                                })
                                yield f"data: {final_data}\n\n"
                        except json.JSONDecodeError:
                            pass
                            
                await asyncio.sleep(0.01)
            
            # Read any remaining stderr (in case "done" was in the buffer)
            remaining_stderr = process.stderr.read()
            for line in remaining_stderr.split('\n'):
                if line.startswith("STATUS:"):
                    status_json = line[7:].strip()
                    yield f"data: {status_json}\n\n"
                    
                    # Also check remaining stderr for done status
                    if not done_received:
                        try:
                            status_data = json.loads(status_json)
                            if status_data.get("status") == "done":
                                done_received = True
                                data_flow_path = os.path.join(ENGINE_PATH, "data_flow.txt")
                                data_flow_content = ""
                                if os.path.exists(data_flow_path):
                                    with open(data_flow_path, 'r', encoding='utf-8', errors='ignore') as f:
                                        data_flow_content = f.read()
                                
                                final_data = json.dumps({
                                    "status": "finished",
                                    "success": True,
                                    "data_flow": data_flow_content
                                })
                                yield f"data: {final_data}\n\n"
                        except json.JSONDecodeError:
                            pass
            
            # Wait for process to fully complete (cleanup runs in background from perspective of user)
            process.wait()
            
            # If we never got a done status, send failure
            if not done_received:
                data_flow_path = os.path.join(ENGINE_PATH, "data_flow.txt")
                data_flow_content = ""
                if os.path.exists(data_flow_path):
                    with open(data_flow_path, 'r', encoding='utf-8', errors='ignore') as f:
                        data_flow_content = f.read()
                
                final_data = json.dumps({
                    "status": "finished",
                    "success": process.returncode == 0,
                    "data_flow": data_flow_content
                })
                yield f"data: {final_data}\n\n"
            
        finally:
            os.unlink(pipeline_path)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


# Legacy non-streaming execute endpoint
@router.get("/{id}/execute")
async def execute_flow(id: UUID, session: SessionDep) -> Dict[str, Any]:
    statement = select(Flow).where(Flow.id == id)
    flow = session.exec(statement).first()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    if not flow.data or not flow.data.get("nodes"):
        raise HTTPException(status_code=400, detail="Flow has no nodes to execute")
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(flow.data, f)
        pipeline_path = f.name
    
    try:
        engine_binary = os.path.join(ENGINE_PATH, "engine.exe") if os.name == 'nt' else os.path.join(ENGINE_PATH, "engine")
        
        result = subprocess.run(
            [engine_binary, pipeline_path],
            capture_output=True,
            cwd=ENGINE_PATH,
            timeout=300
        )
        
        data_flow_path = os.path.join(ENGINE_PATH, "data_flow.txt")
        data_flow_content = ""
        if os.path.exists(data_flow_path):
            with open(data_flow_path, 'r') as f:
                data_flow_content = f.read()
        
        return {
            "success": result.returncode == 0,
            "output": result.stdout.decode('utf-8'),
            "error": result.stderr.decode('utf-8') if result.returncode != 0 else None,
            "data_flow": data_flow_content
        }
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Execution timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(pipeline_path)




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

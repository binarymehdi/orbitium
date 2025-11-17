"""
Defining my flow database model:
---------------------------
- id
- name
- user_id
- ui_representation (json) (nodes, edges)
---------------------------
- created_by
- created_at
- updated_by
- updated_at
# this representation shall be translated to engine_representation
# by using topological sort, and merging the edges and nodes into
# a more optimized data structure
"""

from typing import Any
from sqlmodel import Field, SQLModel, Column  # type: ignore[attr-defined]
from sqlalchemy import JSON
from uuid import UUID, uuid4


class FlowBase(SQLModel):
    name: str = Field(index=True)
    description: str = Field()
    data: dict[str, Any] | None = Field(default=None, nullable=True)


class FlowRead(FlowBase):
    """schema for reading/returning a flow"""
    id: UUID
    
class FlowUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    data: dict[str, Any] | None = None
    
    
    
class Flow(FlowBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, unique=True)
    data: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))

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

from sqlmodel import Field, SQLModel, JSON, Column
from uuid import UUID, uuid4

class FlowBase(SQLModel):
    name: str = Field(index=True)
    desciption: str = Field()
    data: dict | None = Field(default=None, nullable=True)
    
class Flow(FlowBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, unique=True)
    data: dict | None = Field(default=None, sa_column=Column(JSON))
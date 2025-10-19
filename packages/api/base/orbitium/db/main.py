from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlmodel import create_engine, SQLModel, Session
from orbitium.config import settings


from orbitium.db.models.flow import Flow  # type:ignore

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def init_db() -> None:
    """
    Initialize the database by creating all tables.
    This only creates tables if they don't exist - it won't drop or modify existing tables.
    No superuser required - just needs permissions to create tables in the database.
    """
    SQLModel.metadata.create_all(engine)
    
def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
        
        
SessionDep = Annotated[Session, Depends(get_db)]
from sqlmodel import create_engine
from orbitium.config import settings


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def init_db() -> None:
    """
    Initialize the database by creating all tables.
    This only creates tables if they don't exist - it won't drop or modify existing tables.
    No superuser required - just needs permissions to create tables in the database.
    """
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)
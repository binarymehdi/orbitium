from fastapi import APIRouter

router = APIRouter(
    prefix="/flows",
    tags=["flows"]
)


# get flow from database
@router.get("/:id")
async def get_flow_by_id(id):
    return {"msg": f" getting workflow of id={id}"}


@router.post("/initialize_flow")
async def save_flow():
    """
    depends on the database,
    initializes an empty flow and should 
    """
    return 
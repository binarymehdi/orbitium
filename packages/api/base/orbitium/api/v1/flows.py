from fastapi import APIRouter

router = APIRouter(
    prefix="/flows",
    tags=["flows"]
)


# get flow from database
@router.get("/:id")
async def get_flow_by_id(id):
    return {"msg": f" getting workflow of id={id}"}


@router.post("/initialize-flow")
async def save_flow():
    """
    initializes an empty flow, 
    returns it's id, and redirects 
    the user to start editing.
    """
    return 

@router.put("/:id")
async def edit_flow(id):
    """
    for now, each time the user saves the 
    flow, changes at the level of the db
    is established to match the web state
    with the server state. 
    each time user makes an edit on the web, 
    an update is sent
    """
    pass


@router.delete("/:id")
async def delete_flow(id):
    """delete flow, not important rn"""
    pass
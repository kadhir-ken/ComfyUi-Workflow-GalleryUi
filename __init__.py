import os
import json
import folder_paths
from aiohttp import web
from server import PromptServer

# 1. DYNAMIC PATHS: These use ComfyUI's internal logic to find folders
# This replaces the hardcoded "C:/Users/..." paths
INPUT_DIR = folder_paths.get_input_directory()
# This finds the default user workflow directory automatically
WORKFLOW_DIR = os.path.join(folder_paths.base_path, "user", "default", "workflows")

WEB_DIRECTORY = "./web"

# 2. UPDATED ROUTES: Matching the new JS naming convention
@PromptServer.instance.routes.get("/workflow_gallery/get_workflows")
async def get_workflow_list(request):
    if not os.path.exists(WORKFLOW_DIR):
        return web.json_response([])
    
    files = [f for f in os.listdir(WORKFLOW_DIR) if f.endswith('.json')]
    return web.json_response(files)

@PromptServer.instance.routes.get("/workflow_gallery/get_workflow_data")
async def get_workflow_data(request):
    name = request.query.get("name")
    if not name:
        return web.Response(status=400, text="Missing name parameter")
        
    path = os.path.normpath(os.path.join(WORKFLOW_DIR, name))
    
    # Security check: Ensure the user isn't trying to access files outside the workflow dir
    if not path.startswith(os.path.abspath(WORKFLOW_DIR)):
        return web.Response(status=403, text="Access denied")

    if not os.path.exists(path):
        return web.Response(status=404, text="Workflow not found")

    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return web.json_response(data)

# 3. STATIC ROUTE: Maps the input folder so images can be displayed
PromptServer.instance.app.router.add_static('/workflow_gallery/input/', INPUT_DIR)

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
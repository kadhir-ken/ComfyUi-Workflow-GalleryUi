ComfyUI Workflow Gallery
A lightweight, high-performance extension for ComfyUI that adds a visual gallery to browse, search, and instantly load your saved workflows. Instead of hunting through file menus, you can see a preview of the last generated image and load the entire graph with a single click.

✨ Features
Floating Gallery Button: A non-intrusive "🖼️ Gallery" button in the bottom-right of your ComfyUI interface.

Visual Previews: Automatically detects and displays the output/input images associated with your workflows.

Instant Loading: Uses the native ComfyUI file handler to load workflows, ensuring history and tab names are preserved.

Smart Search: A high-speed, filename-only search bar to find specific workflows (e.g., "Jujutsu Kaisen", "Realism XL") instantly.

Non-Destructive UI: Large, "contain" fitted thumbnails so you see the full image aspect ratio without cropping.

Universal Compatibility: Works on Windows, Linux, and Mac by utilizing dynamic pathing.

🚀 Installation
1. Clone the Repository
Open your terminal/command prompt in your ComfyUI custom_nodes folder and run:

Bash
git clone https://github.com/kadhir-ken/ComfyUi-Workflow-GalleryUi.git
2. Restart ComfyUI
Restart your server. The node will automatically locate your user/default/workflows directory.

🛠️ How it Works
Click the Gallery button at the bottom-right of the screen.

The gallery will pop up and scan your saved .json workflows.

Type in the search bar to filter by name.

Click any workflow card to instantly inject it into your workspace.

Click the ✕ in the top-right to close the gallery at any time.

📂 Project Structure
__init__.py: Handles the backend Python API, dynamic pathing, and static image serving.

web/workflow_gallery.js: The frontend logic that builds the UI, handles the search, and manages workflow injection.

🤝 Contributing
Feel free to open issues or submit pull requests. I'm always looking to improve the search speed and UI customizability!

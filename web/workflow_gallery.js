import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "ComfyUI.WorkflowGallery",
    async setup() {
        // 1. Gallery Launch Button
        const floatBtn = document.createElement("div");
        floatBtn.innerText = "🖼️ Gallery";
        Object.assign(floatBtn.style, {
            position: "fixed", 
            bottom: "20px", 
            right: "20px",
            padding: "10px 15px", 
            backgroundColor: "#ff9000", 
            color: "black",
            borderRadius: "8px", 
            cursor: "pointer", 
            zIndex: 9999, 
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
        });
        floatBtn.onclick = () => showGallery();
        document.body.appendChild(floatBtn);

        async function showGallery() {
            const modal = document.createElement("div");
            Object.assign(modal.style, {
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: "90vw", height: "90vh", backgroundColor: "#111", color: "white",
                zIndex: 10002, padding: "30px", overflowY: "auto", border: "2px solid #ff9000", borderRadius: "10px"
            });

            // 2. Fixed Close Button (Top-Right)
            const closeX = document.createElement("div");
            closeX.innerText = "✕";
            Object.assign(closeX.style, {
                position: "absolute", top: "15px", right: "20px",
                fontSize: "26px", cursor: "pointer", color: "#ff9000", fontWeight: "bold"
            });
            closeX.onclick = () => modal.remove();
            modal.appendChild(closeX);

            // 3. Search Bar
            const searchInput = document.createElement("input");
            searchInput.placeholder = "Search workflow names...";
            Object.assign(searchInput.style, {
                width: "calc(100% - 40px)", padding: "12px", marginBottom: "25px", 
                background: "#333", color: "white", border: "1px solid #ff9000", borderRadius: "5px"
            });
            modal.appendChild(searchInput);

            const grid = document.createElement("div");
            Object.assign(grid.style, {
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
                gap: "25px"
            });
            modal.appendChild(grid);
            document.body.appendChild(modal);

            // Note: Ensure your backend __init__.py uses these generalized routes
            const response = await fetch('/workflow_gallery/get_workflows');
            const workflowFiles = await response.json();

            let currentSearchId = 0;

            const renderItems = async (filter = "") => {
                const searchId = ++currentSearchId;
                grid.innerHTML = "";
                
                const filteredFiles = workflowFiles.filter(file => 
                    file.toLowerCase().includes(filter.toLowerCase().trim())
                );

                if (filteredFiles.length === 0) {
                    const noResult = document.createElement("div");
                    noResult.innerText = "No workflows found matching your search.";
                    noResult.style.color = "#666";
                    grid.appendChild(noResult);
                    return;
                }

                for (const file of filteredFiles) {
                    if (searchId !== currentSearchId) return;

                    const dataResp = await fetch(`/workflow_gallery/get_workflow_data?name=${encodeURIComponent(file)}`);
                    const data = await dataResp.json();
                    
                    let imageName = "";
                    const nodes = data.nodes || (data.workflow ? data.workflow.nodes : []);
                    if (nodes) {
                        for (const node of nodes) {
                            const imgVal = node.widgets_values?.find(v => typeof v === 'string' && v.match(/\.(png|jpg|jpeg)$/i));
                            if (imgVal) { imageName = imgVal; break; }
                        }
                    }

                    const item = document.createElement("div");
                    Object.assign(item.style, { 
                        textAlign: "center", cursor: "pointer", background: "#222", 
                        padding: "15px", borderRadius: "10px", border: "1px solid #333"
                    });

                    const img = document.createElement("img");
                    // Using generalized input route
                    img.src = imageName ? `/workflow_gallery/input/${imageName}` : "https://via.placeholder.com/260x220?text=No+Preview";
                    Object.assign(img.style, { 
                        width: "100%", height: "220px", objectFit: "contain", background: "#000",
                        borderRadius: "5px", marginBottom: "12px"
                    });

                    const label = document.createElement("div");
                    label.innerText = file.replace(".json", "");
                    label.style.fontWeight = "bold";

                    item.onclick = async () => {
                        const jsonText = JSON.stringify(data);
                        const virtualFile = new File([jsonText], file, { type: "application/json" });
                        if (app.handleFile) await app.handleFile(virtualFile);
                        else await app.loadGraphData(data);
                        modal.remove();
                    };

                    item.appendChild(img);
                    item.appendChild(label);
                    grid.appendChild(item);
                }
            };

            searchInput.oninput = (e) => renderItems(e.target.value);
            renderItems();
        }
    }
});

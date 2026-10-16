// 1. QUICK-SHOW MODE LOGIC
const quickShowBtn = document.getElementById('quick-show-btn');
if (quickShowBtn) {
    quickShowBtn.addEventListener('click', () => {
        alert("🚨 Police Check Mode Activated!\n\nIn a fully deployed app, this will open a smooth, full-screen gallery showing your DL, RC, Insurance, and PUC for the officer.");
    });
}

// 2. DOCUMENT UPLOAD & AI PROCESSING LOGIC
const fileInputs = document.querySelectorAll('input[type="file"]');

fileInputs.forEach(input => {
    input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Find the specific status text cell in our new table
        const documentType = input.id.split('-')[1]; // e.g., 'dl', 'rc', 'bill'
        const statusEl = document.getElementById(`status-${documentType}`);
        
        if (statusEl) {
            statusEl.textContent = `Scanning ${file.name}...`;
            statusEl.style.color = "var(--accent)";
        }

        try {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('type', documentType);
            
            // For local testing before connecting the real AI
            setTimeout(() => {
                if (statusEl) {
                    statusEl.textContent = "Ready for AI Analysis";
                    statusEl.style.color = "#00e676"; // Green success color
                }
                console.log(`Prepared ${file.name} for backend AI processing.`);
            }, 1000);

        } catch (error) {
            console.error("Upload error:", error);
            if (statusEl) {
                statusEl.textContent = "Upload failed.";
                statusEl.style.color = "red";
            }
        }
    });
});

// 3. SIDEBAR NAVIGATION LOGIC
const sidebarItems = document.querySelectorAll('.menu-list li');

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        // Step A: Remove the orange 'active' highlight from all menu items
        sidebarItems.forEach(el => el.classList.remove('active'));
        
        // Step B: Add the orange 'active' highlight to the specific item you just clicked
        item.classList.add('active');
        
        // Step C: Show a popup since we haven't built the other HTML pages yet
        alert("Navigating to module...\n\n(This will load a different page once we build the rest of the application!)");
    });
});
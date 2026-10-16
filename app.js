// 1. QUICK-SHOW MODE LOGIC
const quickShowBtn = document.getElementById('quick-show-btn');
if (quickShowBtn) {
    quickShowBtn.addEventListener('click', () => {
        alert("🚨 Police Check Mode Activated!\n\nIn a fully deployed app, this will open a smooth, full-screen gallery showing your DL, RC, Insurance, and PUC for the officer.");
    });
}

// Helper function to convert an image file into a Base64 text string
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); 
    reader.onerror = error => reject(error);
});

// 2. DOCUMENT UPLOAD & AI PROCESSING LOGIC
const fileInputs = document.querySelectorAll('input[type="file"]');

fileInputs.forEach(input => {
    input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const documentType = input.id.split('-')[1]; // e.g., 'dl', 'rc', 'bill'
        const statusEl = document.getElementById(`status-${documentType}`);
        
        if (statusEl) {
            statusEl.textContent = `Analyzing with AI...`;
            statusEl.style.color = "var(--accent)";
        }

        try {
            // Convert the image to text
            const base64Data = await toBase64(file);
            
            // Send the text to our Vercel Serverless Function
            const response = await fetch('/api/analyze-document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Data,
                    mimeType: file.type,
                    type: documentType
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (statusEl) {
                    statusEl.textContent = "AI Analysis Complete!";
                    statusEl.style.color = "#00e676";
                }
                // Show the user what the AI found!
                console.log("AI Data:", data);
                alert("🤖 AI Successfully Extracted:\n\n" + JSON.stringify(data.extractedData, null, 2));
            } else {
                throw new Error(data.error || "Failed to analyze");
            }

        } catch (error) {
            console.error("Upload error:", error);
            if (statusEl) {
                statusEl.textContent = "AI Analysis Failed.";
                statusEl.style.color = "red";
            }
        }
    });
});

// 3. REAL SIDEBAR NAVIGATION LOGIC
const sidebarItems = document.querySelectorAll('.menu-list li');

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        const itemName = item.textContent.trim();
        
        if (itemName.includes('Document Vault')) {
            window.location.href = 'index.html';
        } else if (itemName.includes('Workshop Bills')) {
            window.location.href = 'workshop-bills.html';
        } else {
            alert(itemName + " module is under construction!");
        }
    });
});
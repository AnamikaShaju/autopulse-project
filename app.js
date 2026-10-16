        // 1. CUSTOMIZABLE COLOR PICKER LOGIC
// This listens for color changes and updates our CSS variable in real-time
const colorPicker = document.getElementById('accent-color');
colorPicker.addEventListener('input', (event) => {
    document.documentElement.style.setProperty('--accent-color', event.target.value);
});

// 2. QUICK-SHOW MODE LOGIC
// For now, this shows an alert. Later, it can trigger a full-screen image gallery.
const quickShowBtn = document.getElementById('quick-show-btn');
quickShowBtn.addEventListener('click', () => {
    alert("🚨 Police Check Mode Activated!\n\nIn a fully deployed app, this will open a smooth, full-screen gallery showing your DL, RC, Insurance, and PUC for the officer.");
});

// 3. DOCUMENT UPLOAD & AI PROCESSING LOGIC
// Grab all the file upload inputs on the page
const fileInputs = document.querySelectorAll('input[type="file"]');

fileInputs.forEach(input => {
    input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return; // If the user cancels the upload, do nothing

        // Find the specific status text below the button we just clicked
        const documentType = input.id.split('-')[1]; // e.g., 'dl', 'rc', 'bill'
        const statusEl = document.getElementById(`status-${documentType}`);
        
        if (statusEl) {
            statusEl.textContent = `Scanning ${file.name}...`;
            statusEl.style.color = "var(--accent-color)";
        }

        try {
            // We use FormData to package the image/PDF file securely
            const formData = new FormData();
            formData.append('document', file);
            formData.append('type', documentType);
            
            // --- BACKEND CONNECTION ---
            // This fetch call will send the file to our Vercel Serverless Function.
            // Right now, if you run this locally without Vercel, it might show an error, 
            // but it will work perfectly once deployed!
            
            /* 
            const response = await fetch('/api/analyze-document', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            // Un-hide the output section and print the AI's data
            const outputSection = document.getElementById('output-section');
            const outputData = document.getElementById('ai-output-data');
            outputSection.style.display = 'block';
            outputData.textContent = JSON.stringify(data, null, 2);
            */

            // For local testing before deployment, we will simulate a successful scan
            setTimeout(() => {
                if (statusEl) statusEl.textContent = "Ready for AI Analysis (Needs Deployment)";
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
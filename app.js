// 0. AUTH GUARD (Redirect to login if not authenticated)
const currentPage = window.location.pathname.split('/').pop();
const isLoginPage = currentPage === 'login.html';

if (!isLoginPage && !localStorage.getItem('autopulse_user')) {
    window.location.href = 'login.html';
}

// 0.5 GLOBAL PREFERENCES & DYNAMIC LOGOUT
const savedColor = localStorage.getItem('autopulse-theme');
if (savedColor) {
    document.documentElement.style.setProperty('--accent', savedColor);
}

const savedName = localStorage.getItem('autopulse-name');
if (savedName) {
    const profileNameEls = document.querySelectorAll('.profile-text .name');
    profileNameEls.forEach(el => el.textContent = savedName);
}

// Dynamically inject the Logout button into the sidebar
if (!isLoginPage) {
    const menuLabels = document.querySelectorAll('.menu-label');
    menuLabels.forEach(label => {
        if (label.textContent === 'UI ELEMENTS') {
            const menuList = label.nextElementSibling;
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = `<span class="icon">🚪</span> <span style="color: #ff5252;">Logout</span>`;
            logoutLi.addEventListener('click', () => {
                localStorage.removeItem('autopulse_user');
                window.location.href = 'login.html';
            });
            menuList.appendChild(logoutLi);
        }
    });
}

// 1. SETTINGS PAGE LOGIC
const editProfileBtn = document.getElementById('edit-profile-btn');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        const currentName = localStorage.getItem('autopulse-name') || "Austin Robertson";
        const newName = prompt("Enter your new profile name:", currentName);
        
        if (newName && newName.trim() !== "") {
            localStorage.setItem('autopulse-name', newName.trim());
            document.querySelectorAll('.profile-text .name').forEach(el => el.textContent = newName.trim());
        }
    });
}

const swatches = document.querySelectorAll('.swatch');
if (swatches.length > 0) {
    swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            const newColor = e.target.getAttribute('data-color');
            document.documentElement.style.setProperty('--accent', newColor);
            localStorage.setItem('autopulse-theme', newColor);
            
            const statusText = document.getElementById('theme-status');
            statusText.textContent = "Saved!";
            setTimeout(() => { statusText.textContent = "Active"; }, 2000);
        });
    });
}

// 2. QUICK-SHOW MODE LOGIC
const quickShowBtn = document.getElementById('quick-show-btn');
if (quickShowBtn) {
    quickShowBtn.addEventListener('click', () => {
        alert("🚨 Police Check Mode Activated!\n\nIn a fully deployed app, this will open a smooth, full-screen gallery showing your DL, RC, Insurance, and PUC for the officer.");
    });
}

// 3. DOCUMENT UPLOAD & AI PROCESSING LOGIC
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); 
    reader.onerror = error => reject(error);
});

const fileInputs = document.querySelectorAll('input[type="file"]');
fileInputs.forEach(input => {
    input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const documentType = input.id.split('-')[1]; 
        const statusEl = document.getElementById(`status-${documentType}`);
        
        if (statusEl) {
            statusEl.textContent = `Analyzing with AI...`;
            statusEl.style.color = "var(--accent)";
        }

        try {
            const base64Data = await toBase64(file);
            
            const response = await fetch('/api/analyze-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

// 4. REAL SIDEBAR NAVIGATION LOGIC
const sidebarItems = document.querySelectorAll('.menu-list li');
sidebarItems.forEach(item => {
    // Prevent the logout button from triggering this routing logic
    if (item.textContent.includes('Logout')) return;
    
    item.addEventListener('click', () => {
        const itemName = item.textContent.trim();
        
        if (itemName.includes('Dashboard')) {
            window.location.href = 'dashboard.html';
        } else if (itemName.includes('My Vehicles')) {
            window.location.href = 'my-vehicles.html';
        } else if (itemName.includes('Document Vault')) {
            window.location.href = 'index.html'; 
        } else if (itemName.includes('Workshop Bills')) {
            window.location.href = 'workshop-bills.html';
        } else if (itemName.includes('Fuel Logs')) {
            window.location.href = 'fuel-logs.html';
        } else if (itemName.includes('Settings')) {
            window.location.href = 'settings.html';
        } else if (itemName.includes('Alerts')) {
            window.location.href = 'alerts.html';
        }
    });
});
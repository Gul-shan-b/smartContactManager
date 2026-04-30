const fs = require('fs');

const css = `
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

:root {
    --primary: #4f46e5;
    --primary-hover: #4338ca;
    --secondary: #64748b;
    --bg-main: #f1f5f9;
    --bg-card: #ffffff;
    --text-dark: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --danger: #ef4444;
    --success: #10b981;
    --sidebar-width: 260px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

body {
    background-color: var(--bg-main);
    color: var(--text-dark);
}

.app-layout {
    display: flex;
    min-height: 100vh;
}

/* Sidebar */
.sidebar {
    width: var(--sidebar-width);
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    box-shadow: 2px 0 10px rgba(0,0,0,0.03);
}

.profile-section {
    padding: 2rem 1.5rem;
    text-align: center;
    border-bottom: 1px solid var(--border);
}

.profile-section img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    border: 3px solid var(--primary);
}

.profile-section h3 {
    font-size: 1.1rem;
    color: var(--text-dark);
}

.profile-section p {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.sidebar-nav {
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.sidebar-nav a {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1.5rem;
    color: var(--text-dark);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
}

.sidebar-nav a i {
    width: 20px;
    color: var(--secondary);
    transition: color 0.2s;
}

.sidebar-nav a:hover, .sidebar-nav a.active {
    background: var(--primary);
    color: white;
}

.sidebar-nav a:hover i, .sidebar-nav a.active i {
    color: white;
}

/* Main Content */
.main-content {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: 2rem 3rem;
}

.page-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
}

.page-header h1 {
    font-size: 1.8rem;
    color: var(--text-dark);
}

/* Dashboard Cards */
.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: var(--bg-card);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-card h2 {
    font-size: 1rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
}

.stat-card .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
}

.stat-card i {
    font-size: 2rem;
    color: var(--primary);
    opacity: 0.8;
    margin-bottom: 0.5rem;
}

/* Contact Cards */
.contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.contact-card {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.contact-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: var(--border);
}

.contact-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1rem;
}

.contact-photo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--bg-main);
}

.contact-header h3 {
    margin: 0;
    flex: 1;
    font-size: 1.2rem;
    word-break: break-all;
}

.contact-card p {
    margin: 0.5rem 0;
    font-size: 0.95rem;
    display: flex;
    gap: 0.5rem;
}

.contact-card p strong {
    color: var(--secondary);
    min-width: 70px;
}

.card-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
}

.btn {
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
}

.btn-primary {
    background: var(--primary);
    color: white;
}
.btn-primary:hover {
    background: var(--primary-hover);
}

.btn-update {
    background: #e0e7ff;
    color: var(--primary);
    flex: 1;
}
.btn-update:hover {
    background: #c7d2fe;
}

.btn-delete {
    background: #fee2e2;
    color: var(--danger);
    flex: 1;
}
.btn-delete:hover {
    background: #fecaca;
}

/* Forms & Filters */
.search-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    background: var(--bg-card);
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.search-container input, .search-container select {
    padding: 0.6rem 1rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    outline: none;
    font-size: 0.95rem;
}

.search-container input {
    flex: 2;
}
.search-container select {
    flex: 1;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input, .form-group select, .form-group textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    border-color: var(--primary);
}

#addContactForm, #updateContactForm {
    background: var(--bg-card);
    padding: 2rem;
    border-radius: 12px;
    max-width: 600px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* Auth Pages Specific */
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg-main);
}

.auth-card {
    background: var(--bg-card);
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}
.auth-card h1 {
    margin-bottom: 1.5rem;
    color: var(--primary);
}
.auth-card nav {
    margin-bottom: 1.5rem;
}
.auth-card nav a {
    color: var(--secondary);
    text-decoration: none;
    margin: 0 0.5rem;
    font-weight: 500;
}
.auth-card nav a:hover {
    color: var(--primary);
}
.auth-card form {
    text-align: left;
}
.auth-card button {
    width: 100%;
    margin-top: 1rem;
    padding: 0.8rem;
}

.message {
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 6px;
    text-align: center;
}
.message.success { background: #d1fae5; color: var(--success); }
.message.error { background: #fee2e2; color: var(--danger); }
.favourite-btn { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #fbbf24; }

/* Hide old container logic */
.container:not(.app-layout) {
    display: none;
}
`

fs.writeFileSync('c:/Users/User/OneDrive/Desktop/NGD/style.css', css);

const updateHtml = (file, pageTitle, activeNav) => {
    let p = 'c:/Users/User/OneDrive/Desktop/NGD/' + file;
    let html = fs.readFileSync(p, 'utf8');
    
    // Auth pages get different layout
    if (file === 'login.html' || file === 'signup.html') {
        html = html.replace(/<div class="container">/g, '<div class="auth-container"><div class="auth-card">');
        html = html.replace(/<\/main>\s*<\/div>/g, '</main></div></div>');
        fs.writeFileSync(p, html);
        return;
    }
    
    // Grab the main content out of the file
    let mainContent = '';
    const mainMatch = html.match(/<main>([\s\S]*?)<\/main>/);
    if (mainMatch) {
       mainContent = mainMatch[1];
    }
    
    // If we have a sortFilter, explicitly inject the Date ones to replace it completely
    if (mainContent.includes('id="sortFilter"')) {
        mainContent = mainContent.replace(/<select id="sortFilter">[\s\S]*?<\/select>/, `
                <select id="sortFilter">
                    <option value="asc">Name (A-Z)</option>
                    <option value="desc">Name (Z-A)</option>
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                </select>
        `);
    }

    const navCode = `
<div class="app-layout">
    <aside class="sidebar">
        <div class="profile-section">
            <img src="https://ui-avatars.com/api/?background=4f46e5&color=fff&name=User" alt="Profile" id="navAvatar">
            <h3 id="navUserName">Loading User...</h3>
            <p id="navUserEmail">loading...</p>
        </div>
        <nav class="sidebar-nav">
            <a href="index.html" class="${activeNav === 'index' ? 'active' : ''}"><i class="fas fa-home"></i> Dashboard</a>
            <a href="add_contact.html" class="${activeNav === 'add' ? 'active' : ''}"><i class="fas fa-user-plus"></i> Add Contact</a>
            <a href="view_contacts.html" class="${activeNav === 'view' ? 'active' : ''}"><i class="fas fa-users"></i> View Contacts</a>
            <a href="history.html" class="${activeNav === 'history' ? 'active' : ''}"><i class="fas fa-history"></i> History</a>
            <a href="#" id="logoutBtn" style="margin-top:auto"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </nav>
    </aside>
    <main class="main-content">
        <header class="page-header">
            <h1>${pageTitle}</h1>
        </header>
        ${mainContent}
    </main>
</div>
`;

    // Overwrite body with the new navCode + script tags
    const newHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} - Smart Contact Manager</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
${navCode}
    <script src="app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const user = JSON.parse(localStorage.getItem('smartContactUser') || '{}');
            if(user && user.name) {
                const navName = document.getElementById('navUserName');
                const navEmail = document.getElementById('navUserEmail');
                const navAvatar = document.getElementById('navAvatar');
                if(navName) navName.textContent = user.name;
                if(navEmail) navEmail.textContent = user.email;
                if(navAvatar) navAvatar.src = 'https://ui-avatars.com/api/?background=4f46e5&color=fff&name=' + encodeURIComponent(user.name);
            }
            ${file === 'index.html' ? 'if (typeof loadDashboardStats === "function") loadDashboardStats();' : ''}
            ${file === 'view_contacts.html' ? 'if (typeof loadContacts === "function") loadContacts();' : ''}
            ${file === 'history.html' ? 'if (typeof loadHistory === "function") loadHistory();' : ''}
            ${file === 'update_contact.html' ? `
            const docId = new URLSearchParams(window.location.search).get('docId');
            if (docId && typeof loadContactForUpdate === "function") loadContactForUpdate(docId);
            ` : ''}
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(p, newHtml);
}

updateHtml('index.html', 'Dashboard Overview', 'index');
updateHtml('add_contact.html', 'Add New Contact', 'add');
updateHtml('view_contacts.html', 'My Contacts', 'view');
updateHtml('history.html', 'Contact History', 'history');
updateHtml('update_contact.html', 'Update Contact', '');
updateHtml('login.html', 'Login', '');
updateHtml('signup.html', 'Sign Up', '');

// Update app.js sorting and specific card injections for font awesome and UI classes
let appjs = fs.readFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', 'utf8');

// Sort by date injection
const sortRegex = /filteredContacts\.sort\(\(a, b\) => \{[\s\S]*?\}\);/;
const newSortCode = `filteredContacts.sort((a, b) => {
            if (sortOrder === 'asc') return (a.name || '').toLowerCase() > (b.name || '').toLowerCase() ? 1 : -1;
            if (sortOrder === 'desc') return (a.name || '').toLowerCase() < (b.name || '').toLowerCase() ? 1 : -1;
            if (sortOrder === 'date_asc') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
            if (sortOrder === 'date_desc') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            return 0;
        });`;
appjs = appjs.replace(sortRegex, newSortCode);

// Add icons to dashboard cards 
appjs = appjs.replace(/<div class="stat-card">\\n\s*<h2>Total Contacts/g, `<div class="stat-card"><i class="fas fa-address-book"></i><h2>Total Contacts`);
appjs = appjs.replace(/<div class="stat-card">\\n\s*<h2>Friends/g, `<div class="stat-card"><i class="fas fa-user-friends"></i><h2>Friends`);
appjs = appjs.replace(/<div class="stat-card">\\n\s*<h2>Family/g, `<div class="stat-card"><i class="fas fa-home"></i><h2>Family`);
appjs = appjs.replace(/<div class="stat-card">\\n\s*<h2>Work/g, `<div class="stat-card"><i class="fas fa-briefcase"></i><h2>Work`);
appjs = appjs.replace(/<div class="stat-card">\\n\s*<h2>Clients/g, `<div class="stat-card"><i class="fas fa-handshake"></i><h2>Clients`);

// Improve view_contacts cards with FontAwesome
const oldCardRegex = /<div class=\\"contact-header\\">\[\s\S\]*?<div class=\\"card-actions\\">/g; // too complex, just rewriting app.js card innerHTML manually in node
appjs = appjs.replace(/card\.innerHTML = `\[\\s\\S\]*?`;/, `card.innerHTML = \\`
            <div class="contact-header">
                <img src="\${photo}" alt="Photo" class="contact-photo">
                <h3>\${doc.name || 'Unnamed'}</h3>
            </div>
            <p><strong><i class="fas fa-envelope"></i></strong> \${doc.email || 'N/A'}</p>
            <p><strong><i class="fas fa-phone"></i></strong> \${doc.phone || 'N/A'}</p>
            <p><strong><i class="fas fa-map-marker-alt"></i></strong> \${doc.city || 'N/A'}</p>
            <p><strong><i class="fas fa-tag"></i></strong> \${doc.category || 'N/A'}</p>
            <div class="card-actions">
                <a href="update_contact.html?docId=\${doc._id}&rev=\${doc._rev}" class="btn btn-update"><i class="fas fa-edit"></i> Edit</a>
                <button onclick="deleteContact('\${doc._id}', '\${doc._rev}')" class="btn btn-delete"><i class="fas fa-trash"></i> Delete</button>
            </div>
        \\`;`);
        
// Fix Dashboard manually because it's static HTML essentially, wait let me update index.html directly for cards
const indexHtml = fs.readFileSync('c:/Users/User/OneDrive/Desktop/NGD/index.html', 'utf8');
const newCards = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <i class="fas fa-address-book"></i>
                    <h2>Total Contacts</h2>
                    <p id="stat-total" class="stat-number">...</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-user-friends"></i>
                    <h2>Friends</h2>
                    <p id="stat-friends" class="stat-number">...</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-home"></i>
                    <h2>Family</h2>
                    <p id="stat-family" class="stat-number">...</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-briefcase"></i>
                    <h2>Work</h2>
                    <p id="stat-work" class="stat-number">...</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-handshake"></i>
                    <h2>Clients</h2>
                    <p id="stat-clients" class="stat-number">...</p>
                </div>
            </div>`;
fs.writeFileSync('c:/Users/User/OneDrive/Desktop/NGD/index.html', indexHtml.replace(/<div class="dashboard-stats">[\s\S]*?<\/div>\s*<\/div>/, newCards));

fs.writeFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', appjs);
console.log('Modern UI Rewrite Complete!');

const fs = require('fs');
const files = ['index.html', 'add_contact.html', 'view_contacts.html', 'update_contact.html'];
files.forEach(f => {
    let p = 'c:/Users/User/OneDrive/Desktop/NGD/' + f;
    let html = fs.readFileSync(p, 'utf8');
    if (!html.includes('history.html')) {
        let navRegex = /<a href=\"#\" id=\"logoutBtn\">Logout<\/a>/;
        let replaceText = `<a href="history.html">History</a>\n                <a href="#" id="logoutBtn">Logout</a>`;
        html = html.replace(navRegex, replaceText);
        fs.writeFileSync(p, html);
    }
});

let appjs = fs.readFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', 'utf8');
if (!appjs.includes('loadHistory')) {
    const historyCode = `
// =========================================================================
// 6. CONTACT HISTORY (GET REQUEST & SORT BY DATE)
// =========================================================================
async function loadHistory() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;

    try {
        const response = await fetch(\\\`\${dbUrl}/_all_docs?include_docs=true\\\`);
        if (response.ok) {
            const data = await response.json();
            const activeUser = getCurrentUser();
            const activeUserId = activeUser ? activeUser._id : null;
            
            let historyData = data.rows
                .filter(row => !row.id.startsWith('_design/'))
                .map(row => row.doc)
                .filter(doc => doc.userId === activeUserId && doc.created_at);
                
            historyData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            historyContainer.innerHTML = '';
            
            if (historyData.length === 0) {
                historyContainer.innerHTML = '<p>No history found.</p>';
                return;
            }

            historyData.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'contact-card';
                
                const photo = doc.photo ? doc.photo : 'https://ui-avatars.com/api/?background=random&color=fff&name=' + encodeURIComponent(doc.name || 'U');
                const dateAdded = new Date(doc.created_at).toLocaleString();
                
                card.innerHTML = "\\\n" +
                    "    <div class=\\"contact-header\\">\\\n" +
                    "        <img src=\\"" + photo + "\\" alt=\\"Photo\\" class=\\"contact-photo\\">\\\n" +
                    "        <h3>" + (doc.name || 'Unnamed') + "</h3>\\\n" +
                    "    </div>\\\n" +
                    "    <p style=\\"color:#666; font-size: 0.9em; border-bottom:1px solid #ccc; padding-bottom:5px;\\"><strong>Added:</strong> " + dateAdded + "</p>\\\n" +
                    "    <p><strong>Email:</strong> " + (doc.email || '') + "</p>\\\n" +
                    "    <p><strong>Phone:</strong> " + (doc.phone || '') + "</p>\\\n" +
                    "    <p><strong>Category:</strong> " + (doc.category || '') + "</p>\\\n" +
                    "    <div class=\\"card-actions\\">\\\n" +
                    "        <a href=\\"update_contact.html?docId=" + doc._id + "&rev=" + doc._rev + "\\" class=\\"btn btn-update\\">Update</a>\\\n" +
                    "    </div>";
                historyContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error(error);
    }
}
`;
    fs.writeFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', appjs + historyCode.replace(/\\\\/g, ''));
}

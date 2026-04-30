const fs = require('fs');

let target = 'c:/Users/User/OneDrive/Desktop/NGD/app.js';
let app = fs.readFileSync(target, 'utf8');

// The main issue is updating the innerHTML strings
app = app.replace(/card\.innerHTML\s*=\s*(.*?);/s, \
card.innerHTML = "\\
    <div class=\\"contact-header\\">\\
        <img src=\\"" + doc.photo + "\\" alt=\\"" + doc.name + " Photo\\" class=\\"contact-photo\\" onerror=\\"this.src='https://via.placeholder.com/64'\\">\\
        <div class=\\"contact-info-primary\\">\\
            <h3>" + doc.name + "</h3>\\
            <p>" + (doc.work || 'No Work Info') + "</p>\\
        </div>\\
    </div>\\
    <div class=\\"contact-body\\">\\
        <ul class=\\"contact-details\\">\\
            <li><i class=\\"fas fa-envelope\\"></i> " + (doc.email || 'N/A') + "</li>\\
            <li><i class=\\"fas fa-phone\\"></i> " + (doc.phone || 'N/A') + "</li>\\
            <li><i class=\\"fas fa-comment\\"></i> " + (doc.description || 'N/A') + "</li>\\
            <li><i class=\\"fas fa-tags\\"></i> " + (doc.group || 'N/A') + "</li>\\
        </ul>\\
    </div>\\
    <div class=\\"contact-actions\\">\\
        <a href=\\"update_contact.html?docId=" + doc._id + "\\" class=\\"btn btn-edit\\"><i class=\\"fas fa-edit\\"></i> Edit</a>\\
        <button class=\\"btn btn-delete\\" onclick=\\"handleDeleteContact('" + doc._id + "', '" + doc._rev + "')\\"><i class=\\"fas fa-trash\\"></i> Delete</button>\\
    </div>";
\);

app = app.replace(/card\.className\s*=\s*'contact-card';/g, \card.className = 'contact-card';\);

app = app.replace(/card\.innerHTML\s*=\s*\\'<div class="history-item">[\\s\\S]*?<\\/div>\\';/g, \
card.innerHTML = "\\
    <div class=\\"history-header\\">\\
        <div>\\
            <h3>" + doc.name + "</h3>\\
            <p style=\\"color:var(--text-muted);font-size:0.875rem;\\">" + (doc.group || 'Unknown Group') + "</p>\\
        </div>\\
        <span class=\\"history-date\\"><i class=\\"fas fa-clock\\"></i> " + dateStr + "</span>\\
    </div>\\
    <div class=\\"contact-body\\">\\
        <ul class=\\"contact-details\\">\\
            <li><i class=\\"fas fa-envelope\\"></i> " + (doc.email || 'N/A') + "</li>\\
            <li><i class=\\"fas fa-phone\\"></i> " + (doc.phone || 'N/A') + "</li>\\
            <li><i class=\\"fas fa-id-badge\\"></i> ID: " + doc._id + "</li>\\
        </ul>\\
    </div>";
\);

fs.writeFileSync(target, app);
console.log('App.js patched.');

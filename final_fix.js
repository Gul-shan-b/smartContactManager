const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/NGD/app.js';
let content = fs.readFileSync(path, 'utf8');

// The file got ruined because of my previous backslashes, so let's use string manipulation

let startIndex = content.indexOf('card.innerHTML = \\');
if(startIndex !== -1) {
    let endIndex = content.indexOf(';', startIndex);
    while (endIndex !== -1 && !content.substring(startIndex, endIndex + 1).includes('\\;')) {
        endIndex = content.indexOf(';', endIndex + 1);
    }
    
    if (endIndex !== -1) {
        let badStr = content.substring(startIndex, endIndex + 2); // get up to \;
        
        let newContent = `card.innerHTML = \`
            <div class="contact-header">
                <img src="\${photo}" alt="\${doc.name} Photo" class="contact-photo" onerror="this.src='https://via.placeholder.com/64'">
                <div class="contact-info-primary">
                    <h3>\${doc.name}</h3>
                    <p>\${doc.work || 'No Work Info'}</p>
                </div>
            </div>
            <div class="contact-body">
                <ul class="contact-details">
                    <li><i class="fas fa-envelope"></i> \${doc.email || 'N/A'}</li>
                    <li><i class="fas fa-phone"></i> \${doc.phone || 'N/A'}</li>
                    <li><i class="fas fa-comment"></i> \${doc.description || 'N/A'}</li>
                    <li><i class="fas fa-tags"></i> \${doc.group || 'N/A'}</li>
                </ul>
            </div>
            <div class="contact-actions">
                <a href="update_contact.html?docId=\${doc._id}" class="btn btn-edit"><i class="fas fa-edit"></i> Edit</a>
                <button class="btn btn-delete" onclick="handleDeleteContact('\${doc._id}', '\${doc._rev}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        \`;`;
        
        content = content.replace(badStr, newContent);
        fs.writeFileSync(path, content);
        console.log("Fixed app.js main card generation!");
    } else {
        console.log("Could not find end of bad string.");
    }
} else {
    console.log("No bad string found.");
}

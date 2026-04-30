const fs = require('fs');
let app = fs.readFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', 'utf8');
app = app.replace(/card\.innerHTML\\s\*=\\s*\\[\\s\\S];*?\<button/s, `card.innerHTML = \\`
    <div class="contact-header">
        <img src="\\${photo}" alt="\\${doc.name} Photo" class="contact-photo" onerror="this.src='https://via.placeholder.com/64'">
        <div class="contact-info-primary">
            <h3>\\${doc.name}</h3>
            <p>\\${doc.work || 'No Work Info'}</p>
        </div>
    </div>
    <div class="contact-body">
        <ul class="contact-details">
            <li><i class="fas fa-envelope"></i> \\${doc.email || 'N/A'}</li>
            <li><i class="fas fa-phone"></i> \\${doc.phone || 'N/A'}</li>
            <li><i class="fas fa-comment"></i> \\${doc.description || 'N/A'}</li>
            <li><i class="fas fa-tags"></i> \\${doc.group || 'N/A'}</li>
        </ul>
    </div>
    <div class="contact-actions">
        <a href="update_contact.html?docId=\\${doc._id}" class="btn btn-edit"><i class="fas fa-edit"></i> Edit</a>
        <button class="btn btn-delete" onclick="handleDeleteContact('\\${doc._id}', '\\${doc._rev}')"><i class="fas fa-trash"></i> Delete</button>
    </div>
\\`;\nconsole.log('1');`);
fs.writeFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', app);
console.log('Done');

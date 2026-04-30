const fs = require('fs');
const lines = fs.readFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', 'utf8').split('\n');
const fixedLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('card.innerHTML = \\')) {
        skip = true;
        fixedLines.push(\        card.innerHTML = \\\\);
        fixedLines.push(\            <div class="contact-header">\);
        fixedLines.push(\                <img src="\" alt="\ Photo" class="contact-photo" onerror="this.src='https://via.placeholder.com/64'">\);
        fixedLines.push(\                <div class="contact-info-primary">\);
        fixedLines.push(\                    <h3>\</h3>\);
        fixedLines.push(\                    <p>\</p>\);
        fixedLines.push(\                </div>\);
        fixedLines.push(\            </div>\);
        fixedLines.push(\            <div class="contact-body">\);
        fixedLines.push(\                <ul class="contact-details">\);
        fixedLines.push(\                    <li><i class="fas fa-envelope"></i> \</li>\);
        fixedLines.push(\                    <li><i class="fas fa-phone"></i> \</li>\);
        fixedLines.push(\                    <li><i class="fas fa-comment"></i> \</li>\);
        fixedLines.push(\                    <li><i class="fas fa-tags"></i> \</li>\);
        fixedLines.push(\                </ul>\);
        fixedLines.push(\            </div>\);
        fixedLines.push(\            <div class="contact-actions">\);
        fixedLines.push(\                <a href="update_contact.html?docId=\" class="btn btn-edit"><i class="fas fa-edit"></i> Edit</a>\);
        fixedLines.push(\                <button class="btn btn-delete" onclick="handleDeleteContact('\', '\')"><i class="fas fa-trash"></i> Delete</button>\);
        fixedLines.push(\            </div>\);
        fixedLines.push(\        \\\;\);
        continue;
    }
    if (skip && lines[i].includes('\\;')) {
        skip = false;
        continue;
    }
    if (!skip) {
        fixedLines.push(lines[i]);
    }
}
fs.writeFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', fixedLines.join('\n'));
console.log('Fixed lines!');

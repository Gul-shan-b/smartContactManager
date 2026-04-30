const fs = require('fs');
let code = fs.readFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', 'utf8');

// Fix broken fetches
code = code.replace(/fetch\(\\\/\\\_all_docs\?include_docs=true\\\)/g, 'fetch(dbUrl + "/_all_docs?include_docs=true")');
code = code.replace(/fetch\(\\\/\\\?rev=\\\\/g, 'fetch(dbUrl + "/" + docId + "?rev=" + docRev');
code = code.replace(/fetch\(\\\/\\\\\)/g, 'fetch(dbUrl + "/" + docId)');

// Re-write to ensure strings are fully sound
fs.writeFileSync('c:/Users/User/OneDrive/Desktop/NGD/app.js', code);

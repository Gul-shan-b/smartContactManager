const http = require('http');

// Replace these with your actual CouchDB credentials
const DB_USER = 'admin';
const DB_PASS = 'admin123'; // PUT YOUR PASSWORD HERE
const COUCH_URL = 'http://127.0.0.1:5984';

const auth = Buffer.from(`${DB_USER}:${DB_PASS}`).toString('base64');
const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
};

function putConfig(section, key, value) {
    return new Promise((resolve, reject) => {
        const req = http.request(`${COUCH_URL}/_node/_local/_config/${section}/${key}`, {
            method: 'PUT',
            headers: headers
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`✅ Successfully set [${section}] ${key} = ${value}`);
                    resolve();
                } else {
                    console.error(`❌ Failed to set ${key}: ${res.statusCode} ${data}`);
                    reject(new Error(`Status ${res.statusCode}`));
                }
            });
        });
        req.on('error', reject);
        req.write(JSON.stringify(value));
        req.end();
    });
}

async function enableCors() {
    console.log("Configuring CouchDB CORS...");
    try {
        await putConfig('httpd', 'enable_cors', 'true');
        await putConfig('cors', 'origins', '*');
        await putConfig('cors', 'credentials', 'true');
        await putConfig('cors', 'methods', 'GET, PUT, POST, HEAD, DELETE');
        await putConfig('cors', 'headers', 'accept, authorization, content-type, origin, referer, x-csrf-token');
        console.log("\n🎉 CORS is fully enabled! You can now use your specific web app.");
    } catch (e) {
        console.error("\n⚠️ Could not configure CouchDB. Make sure CouchDB is running and your DB_USER/DB_PASS in this script are correct.");
    }
}

enableCors();

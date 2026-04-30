# Smart Contact Manager

Smart Contact Manager is a responsive, web-based application designed to help you securely store, organize, and manage your personal and professional contacts. It uses a modern front-end Interface connected directly to an Apache CouchDB NoSQL backend database using standard RESTful APIs.

## 🚀 Features

- **Dashboard Analytics:** View a graphical summary of your contact database including totals broken down by designated categories.
- **Dynamic Search & Filtering:** Instantly filter your contact list by typing a name or selecting a predefined relationship category seamlessly via client-side rendering.
- **Full CRUD Support:** Directly interact with CouchDB to Create, Read, Update, and Delete data.
- **Modern Responsive UI:** A lightweight and clean interface constructed with heavily curated CSS Grid and Flexbox techniques, making it beautiful across desktop and mobile devices.

## 💻 Technologies Used

- **Frontend:** HTML5, CSS3 (Custom Variables, Grid, Flexbox), Vanilla JavaScript (ES6+).
- **Backend/Database:** Apache CouchDB (NoSQL Document Store).
- **Network Protocol:** Async/Await HTTP \etch()\ API (RESTful JSON).

---

## 🗄️ CouchDB Document Structure

CouchDB stores its data as flexible JSON documents. Every contact added via the User Interface translates into the following JSON format:

\\\json
{
  "_id": "c1f737e42d76f0cb3925...",   // Auto-generated Unique CouchDB Identifier
  "_rev": "1-3bc63df0c349e54a...",    // Auto-generated Revision Token (used for updates/deletes)
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "555-0199",
  "city": "New York",
  "category": "Work",                 // Allowed values: Friends, Family, Work, Clients
  "notes": "Met at the annual tech conference.",
  "createdAt": "2026-03-24T18:00:00.000Z"
}
\\\

---

## ⚙️ How to Run the Project

1. **Install Apache CouchDB:** 
   Ensure you have [CouchDB](http://couchdb.apache.org/) installed and running locally on your machine. By default, it operates on \http://127.0.0.1:5984/\.
2. **Setup the Database:**
   - Open Fauxton (CouchDB's web interface) at \http://127.0.0.1:5984/_utils/\.
   - Create a new database named **\my_website\**.
3. **Configure CORS:**
   - To allow your local browser to talk directly to the CouchDB server, you must enable **CORS** (Cross-Origin Resource Sharing).
   - In Fauxton, navigate to the config settings and establish the CORS domain to allow \*\ (all domains) or precisely \http://127.0.0.1\.
4. **Launch the Interface:**
   Simply double-click the \index.html\ file to open your Dashboard, or serve the directory utilizing a tool like VS Code's \Live Server\.

---

## 🔄 CRUD Operations Explanation

Smart Contact Manager interacts directly with the CouchDB API. Here is how the native JavaScript \etch\ triggers standard database executions:

### 1. Create (POST)
- Uses \method: 'POST'\ targeting \http://localhost:5984/my_website\.
- Bypasses manual ID generation. CouchDB absorbs the incoming JSON body, logs it, and constructs both the \_id\ and \_rev\ variables autonomously.

### 2. Read (GET)
- Targets the custom endpoint \http://localhost:5984/my_website/_all_docs?include_docs=true\.
- Bypasses raw document ID indices, forcing CouchDB to return the full array of detailed JSON records allowing JS to dynamically parse and loop them into HTML cards.

### 3. Update (PUT)
- Targets a specific Document URL: \http://localhost:5984/my_website/{docId}\.
- CouchDB employs **Multi-Version Concurrency Control (MVCC)**. For any update to succeed, the submitted JavaScript JSON payload MUST contain the specific document's current \_rev\ parameter. CouchDB verifies this revision and successfully overrides the document, resulting in a new generated \_rev\.

### 4. Delete (DELETE)
- Issues a raw \method: 'DELETE'\ to a specific Document URL.
- Much like the update feature, MVCC demands passing the revision token. This is handled gracefully by formatting the \etch\ query string as \.../{docId}?rev={docRev}\.

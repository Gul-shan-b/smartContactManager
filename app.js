const DB_USER = 'admin';
const DB_PASS = 'admin123'; // ⚠️ PLEASE PUT YOUR COUCHDB PASSWORD HERE AGAIN! ⚠️

const dbUrl = 'http://127.0.0.1:5984/my_website';
const usersDbUrl = 'http://127.0.0.1:5984/users_db';

const authString = btoa(DB_USER + ':' + DB_PASS);
const headers = { 
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + authString
};

// =========================================================================
// AUTHENTICATION & SESSION MANAGEMENT
// =========================================================================
function getCurrentUser() {
    const userStr = localStorage.getItem('smartContactUser');
    return userStr ? JSON.parse(userStr) : null;
}

function checkAuth() {
    const user = getCurrentUser();
    const isAuthPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('signup.html');
    
    if (!user && !isAuthPage) {
        window.location.href = 'login.html';
    } else if (user && isAuthPage) {
        window.location.href = 'index.html';
    }

    // Attach logout listener if not auth page
    if (!isAuthPage) {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('smartContactUser');
                window.location.href = 'login.html';
            });
        }
    }
}

async function handleSignup(e) {
    if(e) e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const signupMessage = document.getElementById('signupMessage');

    try {
        const checkRes = await fetch(usersDbUrl + '/_all_docs?include_docs=true', { headers,  });
        const checkData = await checkRes.json();
        
        if (checkData.error) {
            signupMessage.className = 'message error';
            signupMessage.textContent = 'Database Error: ' + (checkData.reason || checkData.error) + '. Please ensure users_db exists.';
            return;
        }

        const exists = checkData.rows && checkData.rows.find(r => r.doc.email === email);
        if (exists) {
            signupMessage.className = 'message error';
            signupMessage.textContent = 'Email already registered.';
            return;
        }

        const newUser = {
            _id: 'user_' + Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        const res = await fetch(usersDbUrl + '/' + newUser._id, {
            method: 'PUT',
            headers,
            body: JSON.stringify(newUser)
        });

        if (res.ok) {
            signupMessage.className = 'message success';
            signupMessage.textContent = 'Signup successful! Redirecting to login...';
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        } else {
            signupMessage.className = 'message error';
            signupMessage.textContent = 'Signup failed.';
        }
    } catch (err) {
        console.error(err);
        signupMessage.className = 'message error';
        signupMessage.textContent = 'Server error.';
    }
}

async function handleLogin(e) {
    if(e) e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    try {
        const res = await fetch(usersDbUrl + '/_all_docs?include_docs=true', { headers,  });
        const data = await res.json();
        
        if (data.error) {
            loginMessage.className = 'message error';
            loginMessage.textContent = 'Database Error: ' + (data.reason || data.error) + '. Please ensure users_db exists.';
            return;
        }

        const userRow = data.rows && data.rows.find(r => r.doc.email === email && r.doc.password === password);

        if (userRow) {
            const user = userRow.doc;
            localStorage.setItem('smartContactUser', JSON.stringify({
                _id: user._id,
                name: user.name,
                email: user.email
            }));
            window.location.href = 'index.html';
        } else {
            loginMessage.className = 'message error';
            loginMessage.textContent = 'Invalid email or password.';
        }
    } catch (err) {
        console.error(err);
        loginMessage.className = 'message error';
        loginMessage.textContent = 'Server error.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const addForm = document.getElementById('addContactForm');
    if (addForm) addForm.addEventListener('submit', handleAddContact);

    const updateForm = document.getElementById('updateContactForm');
    if (updateForm) updateForm.addEventListener('submit', handleUpdateContact);

    const pathname = window.location.pathname;
    if (pathname.endsWith('view_contacts.html')) {
        loadContacts();
    } else if (pathname.endsWith('index.html') || pathname === '/' || pathname.endsWith('/NGD/')) {
        loadDashboardStats();
        loadHistory();
    } else if (pathname.endsWith('update_contact.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const docId = urlParams.get('docId');
        if (docId) {
            loadContactForUpdate(docId);
        }
    }
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function handleAddContact(e) {
    if(e) e.preventDefault();
    const user = getCurrentUser();
    if(!user) return;

    const contactMessage = document.getElementById('contactMessage');
    
    let photoData = 'https://via.placeholder.com/64';
    const photoFileElem = document.getElementById('photoFile');
    if (photoFileElem && photoFileElem.files && photoFileElem.files[0]) {
        try {
            photoData = await fileToBase64(photoFileElem.files[0]);
        } catch(err) {
            console.error('Photo conversion failed');
        }
    } else if (document.getElementById('photoUrl') && document.getElementById('photoUrl').value) {
        photoData = document.getElementById('photoUrl').value;
    }

    const newDoc = {
        _id: 'contact_' + Date.now(),
        userId: user._id,
        name: document.getElementById('name') ? document.getElementById('name').value : '',
        work: document.getElementById('work') ? document.getElementById('work').value : '',
        email: document.getElementById('email') ? document.getElementById('email').value : '',
        phone: document.getElementById('phone') ? document.getElementById('phone').value : '',
        city: document.getElementById('city') ? document.getElementById('city').value : '',
        category: document.getElementById('category') ? document.getElementById('category').value : '',
        group: document.getElementById('category') ? document.getElementById('category').value : '',
        photo: photoData,
        description: document.getElementById('description') ? document.getElementById('description').value : '',
        createdAt: new Date().toISOString(),
    };

    try {
        const response = await fetch(dbUrl + '/' + newDoc._id, {
            method: 'PUT',
            headers,
            body: JSON.stringify(newDoc)
        });

        if (response.ok) {
            contactMessage.className = 'message success';
            contactMessage.textContent = 'Contact added successfully!';
            document.getElementById('addContactForm').reset();
            setTimeout(() => { window.location.href = 'view_contacts.html'; }, 1000);
        } else {
            contactMessage.className = 'message error';
            contactMessage.textContent = 'Failed to add contact.';
        }
    } catch (error) {
        console.error(error);
        contactMessage.className = 'message error';
        contactMessage.textContent = 'Server connection error.';
    }
}

let allContactsCache = [];
let currentPage = 1;
const itemsPerPage = 6;

async function loadContacts() {
    const user = getCurrentUser();
    if(!user) return;

    try {
        const response = await fetch(dbUrl + '/_all_docs?include_docs=true', { headers });
        if (response.ok) {
            const data = await response.json();
            allContactsCache = data.rows
                .filter(row => !row.id.startsWith('_design/') && row.doc.userId === user._id)
                .map(row => row.doc);
                
            setupSearchAndFilter();
        } else {
            const data = await response.json();
            const contactsContainer = document.getElementById('contactsContainer');
            if (contactsContainer) contactsContainer.innerHTML = '<p style="color:red; font-weight:bold; text-align:center; padding: 20px;">Database Loading Error: ' + (data.reason || data.error) + '<br>Did you create the "my_website" database in CouchDB?</p>';
        }
    } catch (error) {
        console.error('Error fetching:', error);
        const contactsContainer = document.getElementById('contactsContainer');
        if (contactsContainer) contactsContainer.innerHTML = '<p style="color:red; font-weight:bold; text-align:center; padding: 20px;">Network/CORS Error: Could not connect to CouchDB. Ensure CouchDB is running and CORS is enabled.</p>';
    }
}

function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const sortFilter = document.getElementById('sortFilter');
    const categoryFilter = document.getElementById('categoryFilter');

    // Parse URL params for initial category filter
    if (categoryFilter) {
        const urlParams = new URLSearchParams(window.location.search);
        const initialCategory = urlParams.get('category');
        if (initialCategory) {
            categoryFilter.value = initialCategory;
        }
    }

    const applyFilters = (resetPage = true) => {
        let text = searchInput ? searchInput.value.toLowerCase() : '';
        let category = categoryFilter ? categoryFilter.value.toLowerCase() : '';
        
        let filtered = allContactsCache.filter(c => {
            const matchesText = !text || 
                (c.name && c.name.toLowerCase().includes(text)) ||
                (c.email && c.email.toLowerCase().includes(text));
                
            const matchesCategory = !category || 
                (c.category && c.category.toLowerCase() === category);
                
            return matchesText && matchesCategory;
        });

        if(sortFilter) {
            const val = sortFilter.value;
            filtered.sort((a,b) => {
                if(val === 'asc') return (a.name||'').localeCompare(b.name||'');
                if(val === 'desc') return (b.name||'').localeCompare(a.name||'');
                if(val === 'date_desc') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                if(val === 'date_asc') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                return 0;
            });
        }
        if(resetPage === true) currentPage = 1;
        renderContacts(filtered);
    };

    // Attach slightly modified listeners to prevent page reset on manual pagination clicks
    if(searchInput) searchInput.addEventListener('input', () => applyFilters(true));
    if(sortFilter) sortFilter.addEventListener('change', () => applyFilters(true));
    if(categoryFilter) categoryFilter.addEventListener('change', () => applyFilters(true));

    // Expose applyFilters globally so pagination can call it without resetting page
    window.triggerFilterUpdate = () => applyFilters(false);

    // Apply filters immediately to reflect URL params
    applyFilters(true);
}

function renderContacts(contactsResult) {
    const contactsContainer = document.getElementById('contactsContainer');
    const paginationControls = document.getElementById('paginationControls');
    if (!contactsContainer) return;

    contactsContainer.innerHTML = '';

    if (contactsResult.length === 0) {
        contactsContainer.innerHTML = '<p>No matching contacts found.</p>';
        if (paginationControls) paginationControls.innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(contactsResult.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = contactsResult.slice(startIndex, startIndex + itemsPerPage);

    paginated.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = "<div class='contact-header'>" +
            "<img src='" + doc.photo + "' alt='" + doc.name + " Photo' class='contact-photo' onerror=\"this.src='https://via.placeholder.com/64'\">" +
            "<div class='contact-info-primary'>" +
                "<h3>" + doc.name + "</h3>" +
                "<p>" + (doc.work || doc.category || 'No Work Info') + "</p>" +
            "</div>" +
        "</div>" +
        "<div class='contact-body'>" +
            "<ul class='contact-details'>" +
                "<li><i class='fas fa-envelope'></i> " + (doc.email || 'N/A') + "</li>" +
                "<li><i class='fas fa-phone'></i> " + (doc.phone || 'N/A') + "</li>" +
                "<li><i class='fas fa-comment'></i> " + (doc.description || 'N/A') + "</li>" +
                "<li><i class='fas fa-tags'></i> " + (doc.group || doc.category || 'N/A') + "</li>" +
            "</ul>" +
        "</div>" +
        "<div class='contact-actions'>" +
            "<a href='update_contact.html?docId=" + doc._id + "' class='btn btn-edit'><i class='fas fa-edit'></i> Edit</a>" +
            "<button class='btn btn-delete' onclick=\"handleDeleteContact('" + doc._id + "', '" + doc._rev + "')\"><i class='fas fa-trash'></i> Delete</button>" +
        "</div>";
        contactsContainer.appendChild(card);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginationControls = document.getElementById('paginationControls');
    if (!paginationControls) return;
    paginationControls.innerHTML = '';

    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = (i === currentPage) ? 'active' : '';
            btn.onclick = () => {
                currentPage = i;
                if(typeof window.triggerFilterUpdate === 'function') {
                    window.triggerFilterUpdate();
                }
            };
            btn.style.margin = "0 5px";
            paginationControls.appendChild(btn);
        }
    }
}

async function handleDeleteContact(docId, docRev) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
        const res = await fetch(dbUrl + '/' + docId + '?rev=' + docRev, { method: 'DELETE', headers,  });
        if (res.ok) {
            allContactsCache = allContactsCache.filter(c => c._id !== docId);
            const searchInput = document.getElementById('searchInput');
            if(searchInput) searchInput.dispatchEvent(new Event('input'));
        } else {
            alert('Failed to delete contact.');
        }
    } catch (error) {
        console.error(error);
        alert('Server error while deleting.');
    }
}

async function loadContactForUpdate(docId) {
    const updateMessage = document.getElementById('updateMessage');
    try {
        const response = await fetch(dbUrl + '/' + docId, { headers,  });
        if(response.ok) {
            const doc = await response.json();
            const user = getCurrentUser();
            if(doc.userId !== user._id) {
                updateMessage.className = 'message error';
                updateMessage.textContent = 'Unauthorized access.';
                return;
            }
            
            const updateForm = document.getElementById('updateContactForm');
            if(updateForm) updateForm.style.display = 'block';
            const loadingMsg = document.getElementById('loadingMessage');
            if(loadingMsg) loadingMsg.style.display = 'none';

            if(document.getElementById('update_id')) document.getElementById('update_id').value = doc._id;
            if(document.getElementById('update_rev')) document.getElementById('update_rev').value = doc._rev;
            
            if(document.getElementById('update_name')) document.getElementById('update_name').value = doc.name || '';
            if(document.getElementById('update_work')) document.getElementById('update_work').value = doc.work || '';
            if(document.getElementById('update_email')) document.getElementById('update_email').value = doc.email || '';
            if(document.getElementById('update_phone')) document.getElementById('update_phone').value = doc.phone || '';
            if(document.getElementById('update_city')) document.getElementById('update_city').value = doc.city || '';
            if(document.getElementById('update_category')) document.getElementById('update_category').value = doc.category || doc.group || '';
            if(document.getElementById('update_photoUrl')) document.getElementById('update_photoUrl').value = (doc.photo !== 'https://via.placeholder.com/64') ? doc.photo : '';
            if(document.getElementById('update_notes')) document.getElementById('update_notes').value = doc.description || '';
        }
    } catch(err) {
        console.error(err);
    }
}

async function handleUpdateContact(e) {
    if(e) e.preventDefault();
    const updateMessage = document.getElementById('updateMessage');
    const docId = document.getElementById('update_id') ? document.getElementById('update_id').value : '';

    if (!docId) {
        if(updateMessage) {
            updateMessage.className = 'message error';
            updateMessage.textContent = 'Missing document ID.';
        }
        return;
    }

    let existingDoc = {};
    try {
        const eRes = await fetch(dbUrl + '/' + docId, { headers,  });
        existingDoc = await eRes.json();
    } catch(err) {}

    let photoData = existingDoc.photo || 'https://via.placeholder.com/64';
    const photoFileElem = document.getElementById('update_photoFile');
    if (photoFileElem && photoFileElem.files && photoFileElem.files[0]) {
        try {
            photoData = await fileToBase64(photoFileElem.files[0]);
        } catch(err) {
            console.error('Photo conversion failed');
        }
    } else if (document.getElementById('update_photoUrl') && document.getElementById('update_photoUrl').value) {
        photoData = document.getElementById('update_photoUrl').value;
    }

    const updatedDoc = Object.assign({}, existingDoc, {
        _id: docId,
        _rev: document.getElementById('update_rev') ? document.getElementById('update_rev').value : existingDoc._rev,
        name: document.getElementById('update_name') ? document.getElementById('update_name').value : '',
        work: document.getElementById('update_work') ? document.getElementById('update_work').value : '',
        email: document.getElementById('update_email') ? document.getElementById('update_email').value : '',
        phone: document.getElementById('update_phone') ? document.getElementById('update_phone').value : '',
        city: document.getElementById('update_city') ? document.getElementById('update_city').value : '',
        category: document.getElementById('update_category') ? document.getElementById('update_category').value : '',
        group: document.getElementById('update_category') ? document.getElementById('update_category').value : '',
        photo: photoData,
        description: document.getElementById('update_notes') ? document.getElementById('update_notes').value : '',
        updatedAt: new Date().toISOString()
    });

    try {
        const response = await fetch(dbUrl + '/' + docId, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatedDoc)
        });

        if (response.ok) {
            const data = await response.json();
            if(document.getElementById('update_rev')) document.getElementById('update_rev').value = data.rev;
            if(updateMessage) {
                updateMessage.className = 'message success';
                updateMessage.textContent = 'Contact updated successfully!';
            }
            setTimeout(() => window.location.href = 'view_contacts.html', 1000);
        } else {
            if(updateMessage) {
                updateMessage.className = 'message error';
                updateMessage.textContent = 'Update failed.';
            }
        }
    } catch (error) {
        console.error(error);
        if(updateMessage) {
            updateMessage.className = 'message error';
            updateMessage.textContent = 'Server connection error.';
        }

    }
}

async function loadDashboardStats() {
    const user = getCurrentUser();
    if(!user) return;

    try {
        const response = await fetch(dbUrl + '/_all_docs?include_docs=true', { headers });
        if (response.ok) {
            const data = await response.json();
            const contacts = data.rows
                .filter(row => !row.id.startsWith('_design/') && row.doc.userId === user._id)
                .map(row => row.doc);

            let counts = { total: contacts.length, friends: 0, family: 0, work: 0, clients: 0 };
            contacts.forEach(c => {
                const cat = c.category ? c.category.toLowerCase() : '';
                if (cat === 'friends') counts.friends++;
                else if (cat === 'family') counts.family++;
                else if (cat === 'work') counts.work++;
                else if (cat === 'clients') counts.clients++;
            });

            if(document.getElementById('stat-total')) document.getElementById('stat-total').textContent = counts.total;
            if(document.getElementById('stat-friends')) document.getElementById('stat-friends').textContent = counts.friends;
            if(document.getElementById('stat-family')) document.getElementById('stat-family').textContent = counts.family;
            if(document.getElementById('stat-work')) document.getElementById('stat-work').textContent = counts.work;
            if(document.getElementById('stat-clients')) document.getElementById('stat-clients').textContent = counts.clients;
        } else {
            const dMsg = document.getElementById('dashboardMessage');
            if (dMsg) dMsg.innerHTML = '<p class="message error">Error: Dashboard stats failed to load.</p>';
        }
    } catch (err) {
        console.error(err);
        const dMsg = document.getElementById('dashboardMessage');
        if (dMsg) dMsg.innerHTML = '<p class="message error">Database connection error for dashboard.</p>';
    }
}

async function loadHistory() {
    const user = getCurrentUser();
    if(!user) return;

    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;

    try {
        const response = await fetch(dbUrl + '/_all_docs?include_docs=true', { headers,  });
        if (response.ok) {
            const data = await response.json();
            let historyData = data.rows
                .filter(row => !row.id.startsWith('_design/') && row.doc.userId === user._id)
                .map(row => row.doc)
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

            historyContainer.innerHTML = '';
            if (historyData.length === 0) {
                historyContainer.innerHTML = '<p>No history available.</p>';
                return;
            }

            historyData.forEach((doc) => {
                const dateObj = doc.createdAt ? new Date(doc.createdAt) : new Date();
                const card = document.createElement('div');
                card.className = 'history-card';
                card.innerHTML = "<div class='history-header'>" +
                        "<div>" +
                            "<h3>" + doc.name + "</h3>" +
                            "<p style='color:var(--text-muted);font-size:0.875rem;'>" + (doc.group || doc.category || 'Unknown Group') + "</p>" +
                        "</div>" +
                        "<span class='history-date'><i class='fas fa-clock'></i> " + dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString() + "</span>" +
                    "</div>" +
                    "<div class='contact-body'>" +
                        "<ul class='contact-details'>" +
                            "<li><i class='fas fa-envelope'></i> " + (doc.email || 'N/A') + "</li>" +
                            "<li><i class='fas fa-phone'></i> " + (doc.phone || 'N/A') + "</li>" +
                            "<li><i class='fas fa-id-badge'></i> ID: " + doc._id + "</li>" +
                        "</ul>" +
                    "</div>";
                historyContainer.appendChild(card);
            });
        }
    } catch(err) {
        console.error(err);
    }
}

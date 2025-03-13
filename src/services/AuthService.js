// src/services/AuthService.js

class AuthService {
    constructor() {
        this.dbName = 'webxrAppDB_v';
        this.dbVersion = 1; // Incremented to trigger onupgradeneeded
        this.usersStore = 'users';
        this.scoresStore = 'scores';
        this.db = null;
        this.initDB();
    }

    // Initialize the database
    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create users object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.usersStore)) {
                    db.createObjectStore(this.usersStore, { keyPath: 'email' });
                }

                // Create scores object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.scoresStore)) {
                    const store = db.createObjectStore(this.scoresStore, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('email', 'email', { unique: false });
                    store.createIndex('score', 'score', { unique: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject('Error opening database: ' + event.target.error);
            };
        });
    }

    // Register a new user
    async registerUser(user) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            // Check if user already exists
            this.getUserByEmail(user.email)
                .then(existingUser => {
                    if (existingUser) {
                        reject('User with this email already exists');
                        return;
                    }

                    const transaction = this.db.transaction([this.usersStore], 'readwrite');
                    const store = transaction.objectStore(this.usersStore);

                    // Add password hashing in a real application
                    const newUser = {
                        email: user.email,
                        password: user.password, // In a real app, this should be hashed
                        username: user.username,
                        createdAt: new Date().toISOString()
                    };

                    const request = store.add(newUser);

                    request.onsuccess = () => {
                        // Don't store password in session
                        const { password, ...userWithoutPassword } = newUser;
                        resolve(userWithoutPassword);
                    };

                    request.onerror = (event) => {
                        reject('Error creating user: ' + event.target.error);
                    };
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // Login a user
    async loginUser(email, password) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            this.getUserByEmail(email)
                .then(user => {
                    if (!user) {
                        reject('User not found');
                        return;
                    }

                    if (user.password === password) { // In a real app, compare hashed passwords
                        const { password, ...userWithoutPassword } = user;

                        // Set session
                        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                        resolve(userWithoutPassword);
                    } else {
                        reject('Invalid password');
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // Get user by email
    async getUserByEmail(email) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.usersStore], 'readonly');
            const store = transaction.objectStore(this.usersStore);
            const request = store.get(email);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('Error retrieving user: ' + event.target.error);
            };
        });
    }

    // Log out user
    logoutUser() {
        localStorage.removeItem('currentUser');
    }

    // Check if user is logged in
    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    // Get current user
    getCurrentUser() {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    }
}

export default new AuthService();


class ScoreService {
    constructor() {
        this.dbName = 'webxrAppDB_v'; // Use the new database name
        this.dbVersion = 1; // Match the version in AuthService
        this.scoresStore = 'scores';
        this.db = null;
        this.initDB();
    }

    // Initialize the database
    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject('Error opening database: ' + event.target.error);
            };
        });
    }

    // Save or update score for a user
    async saveScore(email, score) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.scoresStore], 'readwrite');
            const store = transaction.objectStore(this.scoresStore);
            const index = store.index('email');

            // Check if a score entry already exists for the user
            const request = index.get(email);

            request.onsuccess = (event) => {
                const existingScore = event.target.result;

                if (existingScore) {
                    // Update the existing score
                    existingScore.score = score;
                    existingScore.timestamp = new Date().toISOString();

                    const updateRequest = store.put(existingScore);

                    updateRequest.onsuccess = () => {
                        resolve(existingScore);
                    };

                    updateRequest.onerror = (event) => {
                        reject('Error updating score: ' + event.target.error);
                    };
                } else {
                    // Create a new score entry
                    const newScore = {
                        email: email,
                        score: score,
                        timestamp: new Date().toISOString()
                    };

                    const addRequest = store.add(newScore);

                    addRequest.onsuccess = () => {
                        resolve(newScore);
                    };

                    addRequest.onerror = (event) => {
                        reject('Error saving score: ' + event.target.error);
                    };
                }
            };

            request.onerror = (event) => {
                reject('Error retrieving score: ' + event.target.error);
            };
        });
    }

    // Get scores for a user
    async getScoresByEmail(email) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.scoresStore], 'readonly');
            const store = transaction.objectStore(this.scoresStore);
            const index = store.index('email');
            const request = index.getAll(email);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('Error retrieving scores: ' + event.target.error);
            };
        });
    }
}

export default new ScoreService();
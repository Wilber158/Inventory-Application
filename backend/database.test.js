// dbSetup.test.js
const { db, setupDatabase } = require('./database.js');

describe('Database Setup', () => {
    afterAll(() => {
        db.close(); // Close the database connection after tests
    });

    test('database connection is established', () => {
        expect(db).toBeDefined();
        // More specific tests can be added to check if the db object is correctly set up
    });

    test('setupDatabase creates tables', () => {
        // This is a basic test. In reality, you might need to query the database
        // to check if tables are created. This requires a more complex setup.
        expect(() => setupDatabase()).not.toThrow();
    });
});

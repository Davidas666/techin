const postgres = require('postgres');
require('dotenv').config();

const sql = postgres({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'library_management',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'your_password',
});

const testConnection = async () => {
    try {
        await sql`SELECT 1 AS result`;
        console.log('Successful connection to database');
    } catch (error) {
        console.error('Connection to database failed:', error);
        throw error;
    }
};

module.exports = { sql, testConnection };
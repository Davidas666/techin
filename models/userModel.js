const { sql } = require('../dbConnection');

exports.getUserByUsername = async (username) => {
    const [user] = await sql`
        SELECT * FROM users WHERE username = ${username}
    `;
    return user;
};

exports.createUser = async (newUser) => {
    const [user] = await sql`
        INSERT INTO users ${sql(newUser, 'username', 'password', 'role')}
        RETURNING id, username, role
    `;
    return user;
};

exports.getUserById = async (id) => {
    const [user] = await sql`
        SELECT id, username, role FROM users WHERE id = ${id}
    `;
    return user;
};
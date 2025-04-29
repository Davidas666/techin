const {sql} = require('../dbConnection');

exports.getAuthortyById = async (id) => {
    const [difficulties] = await sql`
    SELECT id From authors where authors.id = ${id}
    `;

    return difficulties;
}
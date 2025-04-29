const { sql } = require('../dbConnection');

exports.createBook = async (newBook) => {
    const { title, summary, isbn, author_id } = newBook;

    try {
        const authorCheck = await sql`
            SELECT id FROM authors WHERE id = ${author_id}
        `;
        if (authorCheck.length === 0) {
            throw new Error('Author does not exist');
        }

        const books = await sql`
            INSERT INTO books (title, summary, isbn, author_id) 
            VALUES (${title}, ${summary || null}, ${isbn}, ${author_id})
            RETURNING books.*, 
                (SELECT row_to_json(authors) 
                 FROM authors 
                 WHERE authors.id = books.author_id) as author
        `;
        return books[0];
    } catch (error) {
        console.error('Error creating book:', error);
        throw error;
    }
};

exports.getAllBooks = async ({ page = 1, limit = 10, title, authorId } = {}) => {
    try {
        const offset = (page - 1) * limit;
        let whereClause = [];

        if (title) {
            whereClause.push(`books.title ILIKE ${`%${title}%`}`);
        }
        if (authorId) {
            whereClause.push(`books.author_id = ${authorId}`);
        }

        const whereSql = whereClause.length ? `WHERE ${whereClause.join(' AND ')}` : '';

        const books = await sql`
            SELECT books.*, 
                   row_to_json(authors) as author
            FROM books
            JOIN authors ON books.author_id = authors.id
            ${sql.unsafe(whereSql)}
            ORDER BY books.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const totalCount = await sql`
            SELECT COUNT(*) as count
            FROM books
            ${sql.unsafe(whereSql)}
        `;

        return {
            books,
            pagination: {
                page,
                limit,
                total: parseInt(totalCount[0].count, 10),
                totalPages: Math.ceil(totalCount[0].count / limit),
            },
        };
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

exports.getBookById = async (id) => {
    try {
        const books = await sql`
            SELECT books.*, 
                   row_to_json(authors) as author
            FROM books
            JOIN authors ON books.author_id = authors.id
            WHERE books.id = ${id}
        `;
        return books[0] || null;
    } catch (error) {
        console.error('Error fetching book by ID:', error);
        throw error;
    }
};

exports.getBooksByAuthor = async (authorId) => {
    try {
        const books = await sql`
            SELECT books.*, 
                   row_to_json(authors) as author
            FROM books
            JOIN authors ON books.author_id = authors.id
            WHERE books.author_id = ${authorId}
        `;
        return books;
    } catch (error) {
        console.error('Error fetching books by author:', error);
        throw error;
    }
};

exports.updateBookPart = async (id, updatedBook) => {
    try {
        const columns = Object.keys(updatedBook);
        if (columns.length === 0) {
            throw new Error('No fields provided for update');
        }

        if (updatedBook.author_id) {
            const authorCheck = await sql`
                SELECT id FROM authors WHERE id = ${updatedBook.author_id}
            `;
            if (authorCheck.length === 0) {
                throw new Error('Author does not exist');
            }
        }

        const updated = await sql`
            UPDATE books 
            SET ${sql(updatedBook, columns)}
            WHERE id = ${id}
            RETURNING books.*, 
                      (SELECT row_to_json(authors) 
                       FROM authors 
                       WHERE authors.id = books.author_id) as author
        `;
        return updated[0] || null;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};

exports.deleteBook = async (id) => {
    try {
        const deleted = await sql`
            DELETE FROM books 
            WHERE id = ${id}
            RETURNING *
        `;
        return deleted[0] || null;
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};

exports.getAuthorById = async (id) => {
    try {
        const authors = await sql`
            SELECT authors.*, 
                   COALESCE(
                       (SELECT json_agg(books)
                        FROM books
                        WHERE books.author_id = authors.id),
                       '[]'::json
                   ) as books
            FROM authors
            WHERE authors.id = ${id}
        `;
        return authors[0] || null;
    } catch (error) {
        console.error('Error fetching author by ID:', error);
        throw error;
    }
};

exports.createAuthor = async (newAuthor) => {
    const { name, birth_date, biography } = newAuthor;

    try {
        const authors = await sql`
            INSERT INTO authors (name, birth_date, biography) 
            VALUES (${name}, ${birth_date}, ${biography || null})
            RETURNING *
        `;
        return authors[0];
    } catch (error) {
        console.error('Error creating author:', error);
        throw error;
    }
};

exports.getAllAuthors = async ({ page = 1, limit = 10 } = {}) => {
    try {
        const offset = (page - 1) * limit;

        const authors = await sql`
            SELECT authors.*, 
                   COALESCE(
                       (SELECT json_agg(books)
                        FROM books
                        WHERE books.author_id = authors.id),
                       '[]'::json
                   ) as books
            FROM authors
            ORDER BY authors.name ASC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const totalCount = await sql`
            SELECT COUNT(*) as count FROM authors
        `;

        return {
            authors,
            pagination: {
                page,
                limit,
                total: parseInt(totalCount[0].count, 10),
                totalPages: Math.ceil(totalCount[0].count / limit),
            },
        };
    } catch (error) {
        console.error('Error fetching authors:', error);
        throw error;
    }
};

exports.updateAuthor = async (id, updatedAuthor) => {
    try {
        const columns = Object.keys(updatedAuthor);
        if (columns.length === 0) {
            throw new Error('No fields provided for update');
        }

        const updated = await sql`
            UPDATE authors 
            SET ${sql(updatedAuthor, columns)}
            WHERE id = ${id}
            RETURNING *
        `;
        return updated[0] || null;
    } catch (error) {
        console.error('Error updating author:', error);
        throw error;
    }
};

exports.deleteAuthor = async (id) => {
    try {
        const booksCheck = await sql`
            SELECT id FROM books WHERE author_id = ${id} LIMIT 1
        `;
        if (booksCheck.length > 0) {
            throw new Error('Cannot delete author with existing books');
        }

        const deleted = await sql`
            DELETE FROM authors 
            WHERE id = ${id}
            RETURNING *
        `;
        return deleted[0] || null;
    } catch (error) {
        console.error('Error deleting author:', error);
        throw error;
    }
};
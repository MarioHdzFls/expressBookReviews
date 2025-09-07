const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarea 6: Registrar un nuevo usuario
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "No se proporcionó nombre de usuario y/o contraseña." });
    }

    // Verificar si el usuario ya existe
    const doesExist = users.filter((user) => user.username === username).length > 0;

    if (doesExist) {
        return res.status(409).json({ message: "El usuario ya existe." });
    }

    // Registrar nuevo usuario
    users.push({ "username": username, "password": password });
    return res.status(201).json({ message: "Usuario registrado exitosamente. Ahora puede iniciar sesión." });
});

// Tarea 1: Obtener la lista de libros disponibles en la tienda
public_users.get('/', function (req, res) {
    // Devolver la lista de libros formateada como JSON
    res.status(200).send(JSON.stringify(books, null, 4));
});

// Tarea 10: Obtener la lista de libros disponibles en la tienda (usando async-await)
public_users.get('/', async function (req, res) {
    try {
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });
        const allBooks = await getBooks;
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener la lista de libros" });
    }
});

// Tarea 2: Obtener detalles del libro basado en el ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Libro no encontrado" });
    }
});

// Tarea 11: Obtener detalles del libro basado en el ISBN (usando async-await)
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            resolve(books[isbn]);
        });
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Libro no encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener detalles del libro por ISBN" });
    }
});

// Tarea 3: Obtener detalles del libro basado en el autor
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = [];
    const bookKeys = Object.keys(books);

    for (const key of bookKeys) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(books[key]);
        }
    }

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No se encontraron libros de ese autor" });
    }
});

// Tarea 12: Obtener detalles del libro basado en el Autor (usando async-await)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            const allBooks = Object.values(books);
            const filteredBooks = allBooks.filter(book => book.author.toLowerCase() === author);
            resolve(filteredBooks);
        });

        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "No se encontraron libros de ese autor" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener libros por autor" });
    }
});

// Tarea 4: Obtener todos los libros basados en el título
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];
    const bookKeys = Object.keys(books);

    for (const key of bookKeys) {
        if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            booksByTitle.push(books[key]);
        }
    }

    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No se encontraron libros con ese título" });
    }
});

// Tarea 13: Obtener detalles del libro basado en el Título (usando async-await)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            const allBooks = Object.values(books);
            const filteredBooks = allBooks.filter(book => book.title.toLowerCase().includes(title));
            resolve(filteredBooks);
        });

        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "No se encontraron libros con ese título" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener libros por título" });
    }
});

// Tarea 5: Obtener reseña del libro
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Reseñas no encontradas para este libro" });
    }
});

module.exports.general = public_users;
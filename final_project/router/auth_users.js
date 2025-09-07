const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    // Verifica si ya existe un usuario con el mismo nombre.
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    // Verifica si el nombre de usuario y la contraseña coinciden con un usuario registrado.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Tarea 7: Iniciar sesión como un usuario registrado
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error al iniciar sesión" });
    }

    if (authenticatedUser(username, password)) {
        // Se crea el token de acceso JWT
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Se guarda el token en la sesión del usuario
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Usuario ha iniciado sesión exitosamente");
    } else {
        return res.status(208).json({ message: "Credenciales inválidas. Verifique el usuario y la contraseña" });
    }
});

// Tarea 8: Agregar o modificar una reseña de un libro
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        let book = books[isbn];
        // Se agrega o se modifica la reseña del usuario actual
        book.reviews[username] = review;
        return res.status(200).send("La reseña ha sido añadida/modificada exitosamente.");
    } else {
        return res.status(404).json({ message: `Libro con ISBN ${isbn} no encontrado` });
    }
});

// Tarea 9: Eliminar una reseña de un libro
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        let book = books[isbn];
        // Se verifica si el usuario actual tiene una reseña para eliminar
        if (book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).send("La reseña ha sido eliminada exitosamente.");
        } else {
            return res.status(404).json({ message: "No se encontró una reseña de este usuario para eliminar." });
        }
    } else {
        return res.status(404).json({ message: `Libro con ISBN ${isbn} no encontrado.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


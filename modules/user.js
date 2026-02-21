const express = require('express');
const router = express.Router();

// Fake database
let users = [
    { id: 1, name: "Huân Test" },
    { id: 2, name: "Admin" }
];

// GET all users
router.get('/', (req, res) => {
    res.json(users);
});


// CREATE user
router.post('/', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

module.exports = router;

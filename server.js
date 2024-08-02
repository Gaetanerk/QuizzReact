const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, 'public/json/users.json');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier users.json' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/users', (req, res) => {
    const newUser = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier users.json' });
        }

        const users = JSON.parse(data);
        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'écriture du fichier users.json' });
            }

            res.status(201).json(newUser);
        });
    });
});

app.post('/update-score', (req, res) => {
    const { name, newScore, niveau } = req.body;

    if (!name || newScore === undefined || niveau === undefined) {
        return res.status(400).json({ error: 'Nom utilisateur, score et niveau sont nécessaires' });
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier users.json' });
        }

        const users = JSON.parse(data);

        const user = users.find(u => u.name === name);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        user.score = newScore;
        user.niveau = niveau;

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'écriture du fichier users.json' });
            }

            res.status(200).json({ message: 'Score et niveau mis à jour avec succès' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
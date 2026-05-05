const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database-sqlite');
const router = express.Router();

router.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body.username);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username et password requis' });
    }
    
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Erreur base de données' });
        }
        
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }
        
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Invalid password for:', username);
                return res.status(401).json({ message: 'Identifiants incorrects' });
            }
            
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role, company: user.company },
                process.env.JWT_SECRET || 'adem_rent_car_secret_key_2024',
                { expiresIn: '30d' }
            );
            
            console.log('Login successful:', username);
            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    company: user.company
                }
            });
        } catch (error) {
            console.error('Bcrypt error:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    });
});

// Route pour créer les utilisateurs par défaut
router.post('/init', async (req, res) => {
    try {
        // Vérifier si admin existe
        db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, user) => {
            if (!user) {
                const hashedPassword = await bcrypt.hash('admin123', 10);
                db.run(
                    'INSERT INTO users (username, password, role, company) VALUES (?, ?, ?, ?)',
                    ['admin', hashedPassword, 'admin', 'Administrateur']
                );
                
                const hashedPassword2 = await bcrypt.hash('sous123', 10);
                db.run(
                    'INSERT INTO users (username, password, role, company) VALUES (?, ?, ?, ?)',
                    ['sous1', hashedPassword2, 'sous_traitant', 'Adem Rent Car']
                );
                
                const hashedPassword3 = await bcrypt.hash('sous456', 10);
                db.run(
                    'INSERT INTO users (username, password, role, company) VALUES (?, ?, ?, ?)',
                    ['sous2', hashedPassword3, 'sous_traitant', 'Location Express']
                );
                
                res.json({ message: 'Utilisateurs créés avec succès' });
            } else {
                res.json({ message: 'Utilisateurs déjà existants' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur' });
    }
});

module.exports = router;
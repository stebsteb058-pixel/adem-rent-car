const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../adem_rent_car.db');
const db = new sqlite3.Database(dbPath);

console.log('📁 Base de données SQLite:', dbPath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT,
            company TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erreur création table users:', err);
        else console.log('✅ Table users vérifiée/créée');
    });
db.run(`CREATE TABLE IF NOT EXISTS counters (
    name TEXT PRIMARY KEY,
    value INTEGER
)`);


db.run(`INSERT OR IGNORE INTO counters (name, value) VALUES ('contrat_num', 1)`);
  
    db.run(`
        CREATE TABLE IF NOT EXISTS contrats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_contrat TEXT UNIQUE,
            createur TEXT,
            createurNom TEXT,
            dateCreation DATETIME,
            nom TEXT, prenom TEXT, dateNaiss TEXT, nationalite TEXT,
            cin TEXT, cinDate TEXT, permis TEXT, permisDate TEXT,
            adresse TEXT, tel TEXT, dateEntree TEXT,
            cond2_nom TEXT, cond2_prenom TEXT, cond2_naissance TEXT,
            cond2_nationalite TEXT, cond2_cin TEXT, cond2_cinDate TEXT,
            cond2_permis TEXT, cond2_permisDate TEXT, cond2_adresse TEXT,
            cond2_tel TEXT, cond2_dateEntree TEXT,
            modele TEXT, immat TEXT, kmsDepart INTEGER, kmsRetour INTEGER,
            carburant TEXT, niveauCarbu TEXT,
            roueSecours INTEGER, cric INTEGER, radio INTEGER, enjoliveur INTEGER,
            retroviseurs INTEGER, climatiseur INTEGER, gps INTEGER, siegeBebe INTEGER,
            dateDepart TEXT, heureDepart TEXT, dateRetour TEXT, heureRetour TEXT,
            nbJours INTEGER, prixJournalier REAL, locationHT REAL,
            assuranceRC REAL, assurancePers REAL, penalite REAL,
            tva REAL, totalTTC REAL, lieu TEXT, dateSignature TEXT, dommages TEXT
        )
    `, (err) => {
        if (err) console.error('Erreur création table contrats:', err);
        else console.log('✅ Table contrats vérifiée/créée');
    });
    
    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            createur TEXT,
            type TEXT,
            nom TEXT, prenom TEXT, dateNaiss TEXT, nationalite TEXT,
            cin TEXT, cinDate TEXT, permis TEXT, permisDate TEXT,
            adresse TEXT, tel TEXT, dateEntree TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erreur création table clients:', err);
        else console.log('✅ Table clients vérifiée/créée');
    });
    
    db.run(`
        CREATE TABLE IF NOT EXISTS vehicules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            createur TEXT,
            modele TEXT,
            immat TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erreur création table vehicules:', err);
        else console.log('✅ Table vehicules vérifiée/créée');
    });
db.run(`
    CREATE TABLE IF NOT EXISTS historique_contrats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contrat_numero TEXT,
        dateModification DATETIME,
        ancienne_dateRetour TEXT,
        nouvelle_dateRetour TEXT,
        ancien_kmsRetour INTEGER,
        nouveau_kmsRetour INTEGER,
        historique TEXT,
        modifie_par TEXT
    )
`, (err) => {
    if (err) console.error('Erreur création table historique_contrats:', err);
    else console.log('✅ Table historique_contrats vérifiée/créée');
});
    setTimeout(() => {
        const hashPassword = (password, callback) => {
            bcrypt.hash(password, 10, callback);
        };
        
        hashPassword('admin123', (err, hashedAdmin) => {
            if (!err) {
                db.run(`INSERT OR IGNORE INTO users (username, password, role, company) VALUES (?, ?, ?, ?)`,
                    ['admin', hashedAdmin, 'admin', 'Administrateur']);
            }
        });
        
        hashPassword('sous123', (err, hashedSous1) => {
            if (!err) {
                db.run(`INSERT OR IGNORE INTO users (username, password, role, company) VALUES (?, ?, ?, ?)`,
                    ['sous1', hashedSous1, 'sous_traitant', 'Adem Rent Car']);
            }
        });
        
        hashPassword('sous456', (err, hashedSous2) => {
            if (!err) {
                db.run(`INSERT OR IGNORE INTO users (username, password, role, company) VALUES (?, ?, ?, ?)`,
                    ['sous2', hashedSous2, 'sous_traitant', 'Location Express']);
            }
        });
    }, 500);
});

module.exports = db;
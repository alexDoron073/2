const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;
const REACT_BUILD_PATH = path.join(__dirname, 'my-app', 'build');

app.use(express.json());
app.use(express.static(REACT_BUILD_PATH));

const db = new sqlite3.Database('chat.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Подключено к базе данных SQLite.');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    text TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.get('/api/messages', (req, res) => {
    db.all('SELECT * FROM messages ORDER BY timestamp ASC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/messages', (req, res) => {
    const { username, text } = req.body;
    if (!username || !text) {
        return res.status(400).json({ error: 'username и text обязательны' });
    }
    db.run('INSERT INTO messages (username, text) VALUES (?, ?)', [username, text], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, username, text });
    });
});

app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'Неверный id' });
    }
    db.run('DELETE FROM messages WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Запись не найдена' });
        }
        res.json({ success: true, deletedId: Number(id) });
    });
});

app.patch('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'Неверный id' });
    }
    const { username, text } = req.body;
    if (username === undefined && text === undefined) {
        return res.status(400).json({ error: 'Нет данных для обновления' });
    }

    const fields = [];
    const values = [];
    if (username !== undefined) {
        fields.push('username = ?');
        values.push(username);
    }
    if (text !== undefined) {
        fields.push('text = ?');
        values.push(text);
    }
    values.push(id);

    const sql = `UPDATE messages SET ${fields.join(', ')} WHERE id = ?`;
    db.run(sql, values, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Запись не найдена' });
        }
        db.get('SELECT * FROM messages WHERE id = ?', [id], (err2, row) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ success: true, message: row });
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(REACT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

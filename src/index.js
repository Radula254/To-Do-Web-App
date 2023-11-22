const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

//Create Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo'
});

try {
    connection.connect();
    console.log('Connected');
} catch (e) {
    console.log('Connection Failed');
    console.log(e);
}

const api = express();
api.use(express.static(__dirname + '/public')); 
api.use(bodyParser.json());


api.listen(3000, () => {
    console.log('API is running on port 3000');
});

api.get('/tasks', (req, res) => {
    connection.query('SELECT * FROM tasks ORDER BY created DESC', (error, results) => {
        if (error) return res.json({ error: error });

        res.json({
            todo: results.filter(item => !item.completed),
            completed: results.filter(item => item.completed)
        });
    });
});


api.post('/tasks/add', (req, res) => {
    console.log(req.body);

    connection.query('INSERT INTO tasks (descriptiion) VALUES (?)', [req.body.item], (error, results) => {
        if (error) return res.json({ error: error });

        connection.query('SELECT LAST_INSERT_ID() FROM tasks', (error, results) => {
            if (error) return res.json({ error: error });

            res.json ({
                id: results[0]['LAST_INSERT_ID()'],
                descriptiion: req.body.item
            });
        });
    });
});

api.post('/tasks/:id/update', (req, res) => {
    connection.query('UPDATE tasks SET completed = ? WHERE id = ?', [req.body.completed, req.params.id], (error, results) => {
        if (error) return res.json({ error: error });

        res.json({});
    });
});

api.post('/tasks/:id/remove', (req, res) => {
    connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (error, results) => {
        if (error) return res.json({ error: error });

        res.json({});
    });
});



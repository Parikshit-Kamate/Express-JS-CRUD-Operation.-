const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];
let currentId = 1;

app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json({
            error: 'task not found'
        });
    }
});

app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({
            error: 'title and description are required'
        });
    }
    const newTask = {
        id: currentId++,
        title,
        description
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.post('/tasks/add', (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({
            error: 'array of tasks is required'
        });
    }
    let newTasks = [];
    for (const item of req.body) {
        const { title, description } = item;
        if (!title || !description) {
            return res.status(400).json({
                error: 'title and description are required for all tasks'
            });
        }
        const newTask = {
            id: currentId++,
            title,
            description
        };
        tasks.push(newTask);
        newTasks.push(newTask);
    }
    res.status(201).json(newTasks);
});

app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (task) {
        const { title, description } = req.body;
        if (title && description) {
            task.title = title;
            task.description = description;
            res.status(200).json(task);
        } else {
            res.status(400).json({
                error: 'title and description are required'
            });
        }
    } else {
        res.status(404).json({
            error: 'task not found'
        });
    }
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        const deletedTask = tasks.splice(index, 1)[0];
        res.status(200).json({
            message: 'task deleted successfully', task: deletedTask
        });
    } else {
        res.status(404).json({
            error: 'task not found'
        });
    }
});

app.listen(5000, () => {
    console.log('server is running');
});

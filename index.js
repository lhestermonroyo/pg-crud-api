const express = require('express');
const pool = require('./db');

const app = express();

// access req.body
app.use(express.json());

// get todolist
app.get('/todos', async (req, res) => {
  try {
    const todoList = await pool.query('SELECT * FROM todo');

    res.status(200).json({
      status: 200,
      message: 'Todo list has been fetched',
      todoList: todoList.rows,
    });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: error.message });
  }
});

// get single todo
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todoItem = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [
      id,
    ]);

    res.status(200).json({
      status: 200,
      message: 'Todo details has been fetched',
      todo: todoItem.rows[0],
    });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: error.message });
  }
});

// create todo
app.post('/todos/add', async (req, res) => {
  try {
    const { title, description, is_finished } = req.body;

    const newTodo = await pool.query(
      'INSERT INTO todo (title, description, is_finished) VALUES ($1, $2, $3) RETURNING *',
      [title, description, is_finished]
    );

    res.status(201).json({
      status: 201,
      message: 'Todo has been created!',
      todo: newTodo.rows[0],
    });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: error.message });
  }
});

// update todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, is_finished } = req.body;

    const updateTodo = await pool.query(
      'UPDATE todo SET title = $1, description = $2, is_finished = $3 WHERE todo_id = $4 RETURNING *',
      [title, description, is_finished, id]
    );

    res.status(200).json({
      status: 200,
      message: 'Todo has been updated!',
      todo: updateTodo.rows[0],
    });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: error.message });
  }
});

// delete todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTodo = await pool.query(
      'DELETE FROM todo WHERE todo_id = $1 RETURNING *',
      [id]
    );

    res.status(200).json({
      status: 200,
      message: 'Todo has been deleted!',
      todoList: deleteTodo,
    });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(8080, err => {
  if (err) throw err;

  console.log('Server open at port:', 8080);
});

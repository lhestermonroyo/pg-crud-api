CREATE DATABASE todo_db;

--\c into todo_db

CREATE TABLE todo(
  todo_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR(255),
  is_finished BOOLEAN NOT NULL
);
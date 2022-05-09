CREATE USER administrator;
CREATE DATABASE flights;
GRANT ALL PRIVILEGES ON DATABASE flights TO administrator;
\c flights
CREATE TABLE IF NOT EXISTS potato (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30)
);

INSERT INTO potato (name, email)
  VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com');
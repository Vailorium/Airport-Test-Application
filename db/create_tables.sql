CREATE USER administrator;
CREATE DATABASE flights_db;
GRANT ALL PRIVILEGES ON DATABASE flights_db TO administrator;
\c flights_db
CREATE TABLE IF NOT EXISTS users (
  id INT GENERATED ALWAYS AS IDENTITY,
  display_name VARCHAR(50) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  salt VARCHAR(50) NOT NULL,
  CONSTRAINT pk_user PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS planes (
  id INT GENERATED ALWAYS AS IDENTITY,
  seats INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  CONSTRAINT pk_plane PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS flights (
  id INT GENERATED ALWAYS AS IDENTITY,
  flight_route VARCHAR(100) NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  price INT NOT NULL,
  plane_id INT NOT NULL,
  CONSTRAINT pk_flight PRIMARY KEY (id),
  CONSTRAINT fk_flights_planes
    FOREIGN KEY (plane_id)
      REFERENCES planes(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT GENERATED ALWAYS AS IDENTITY,
  user_id INT NOT NULL,
  flight_id INT NOT NULL,
  CONSTRAINT pk_booking PRIMARY KEY (id),
  CONSTRAINT fk_bookings_users
    FOREIGN KEY (user_id)
      REFERENCES users(id),
  CONSTRAINT fk_bookings_flights
    FOREIGN KEY (flight_id)
      REFERENCES flights(id)
);
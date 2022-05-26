CREATE USER administrator;
CREATE DATABASE flights_db;
GRANT ALL PRIVILEGES ON DATABASE flights_db TO administrator;
\c flights_db
CREATE TABLE IF NOT EXISTS users (
  id INT GENERATED ALWAYS AS IDENTITY,
  display_name VARCHAR(50) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password BYTEA NOT NULL,
  salt BYTEA NOT NULL,
  CONSTRAINT pk_user PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS planes (
  id INT GENERATED ALWAYS AS IDENTITY,
  seats INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  CONSTRAINT pk_plane PRIMARY KEY (id)
);

/* handles main flights, flights can have multiple routes */
CREATE TABLE IF NOT EXISTS flights (
  id INT GENERATED ALWAYS AS IDENTITY,
  plane_id INT NOT NULL,
  CONSTRAINT pk_flight PRIMARY KEY (id),
  CONSTRAINT fk_flights_planes
    FOREIGN KEY (plane_id)
      REFERENCES planes(id)
);

/* search for available seats based on plane id */
CREATE TABLE IF NOT EXISTS routes (
  id INT GENERATED ALWAYS AS IDENTITY,
  flight_id INT NOT NULL,
  departure_location VARCHAR(50) NOT NULL,
  arrival_location VARCHAR(50) NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  price INT NOT NULL,
  CONSTRAINT pk_route PRIMARY KEY (id),
  CONSTRAINT fk_routes_flights
    FOREIGN KEY (flight_id)
      REFERENCES flights(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT GENERATED ALWAYS AS IDENTITY,
  user_id INT NOT NULL,
  route_id INT NOT NULL,
  CONSTRAINT pk_booking PRIMARY KEY (id),
  CONSTRAINT fk_bookings_users
    FOREIGN KEY (user_id)
      REFERENCES users(id),
  CONSTRAINT fk_bookings_routes
    FOREIGN KEY (route_id)
      REFERENCES routes(id)
);
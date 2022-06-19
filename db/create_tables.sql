CREATE USER administrator;
CREATE DATABASE flights_db;
GRANT ALL PRIVILEGES ON DATABASE flights_db TO administrator;
\c flights_db
CREATE TABLE IF NOT EXISTS users (
  id INT GENERATED ALWAYS AS IDENTITY,
  display_name VARCHAR(50) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  salt VARCHAR(100) NOT NULL,
  CONSTRAINT pk_user PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS planes (
  id INT GENERATED ALWAYS AS IDENTITY,
  seats INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  CONSTRAINT pk_plane PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS airports (
  code VARCHAR(4) NOT NULL,
  name VARCHAR(50) NOT NULL,
  CONSTRAINT pk_airport PRIMARY KEY (code)
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
  departure_location VARCHAR(4) NOT NULL,
  arrival_location VARCHAR(4) NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  price INT NOT NULL,
  CONSTRAINT pk_route PRIMARY KEY (id),
  CONSTRAINT fk_routes_flights
    FOREIGN KEY (flight_id)
      REFERENCES flights(id),
  CONSTRAINT fk_routes_departure_airports
    FOREIGN KEY (departure_location)
      REFERENCES airports(code),
  CONSTRAINT fk_routes_arrival_airports
    FOREIGN KEY (arrival_location)
      REFERENCES airports(code)
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

CREATE VIEW available_flights_table AS
SELECT
	flights.id as flight_id,
	planes.name as plane_name, planes.seats as plane_capacity,
	routes.id as route_id, routes.departure_location, routes.departure_time, routes.arrival_location, routes.arrival_time, routes.price,
	departure_airport.name as departure_location_full, arrival_airport.name as arrival_location_full,
	COUNT(bookings.id) as seats
FROM flights
INNER JOIN
	planes ON planes.id = flights.plane_id
INNER JOIN
	routes ON routes.flight_id = flights.id
INNER JOIN 
  airports departure_airport ON departure_airport.code = routes.departure_location
INNER JOIN
  airports arrival_airport ON arrival_airport.code = routes.arrival_location
LEFT JOIN
	bookings ON bookings.route_id = routes.id
GROUP BY
	flights.id,
	planes.name, planes.seats,
	routes.id, routes.departure_location, routes.departure_time, routes.arrival_location, routes.arrival_time, routes.price,
	departure_airport.name, arrival_airport.name;

DO
$do$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM users) THEN
    /* username: test, password: asdfasdf */
    INSERT INTO users (display_name, username, password, salt)
    VALUES ('test', 'test', '8a333b2c806cb87fd21cd3db8bbb1746c1c2e400f72b1dfcae6b4ef84a32ee16', 'f94304f12e335d3e7e399538e947eab1');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM airports) THEN
    INSERT INTO airports (code, name)
    VALUES ('NZNE', 'Dairy Flat'), ('NZRO', 'Rotorua'), ('YSSY', 'Sydney'), ('NZCI', 'Tuuta'), ('NZGB', 'Claris'), ('NZTL', 'Lake Tekapo');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM planes) THEN
    INSERT INTO planes (seats, name)
    VALUES (6, 'SyberJet SJ30i'), (4, 'Cirrus SF50 A'), (4, 'Cirrus SF50 B'), (5, 'HondaJet Elite A'), (5, 'HondaJet Elite B');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM flights) THEN
    INSERT INTO flights (plane_id)
    VALUES (1), (2), (3), (4), (5);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM routes) THEN
    INSERT INTO routes(flight_id, departure_location, arrival_location, departure_time, arrival_time, price)
    VALUES (1, 'NZNE', 'NZRO', '2022-06-30 22:30:00+12', '2022-06-30 23:00:00', 5000),
      (1, 'NZRO', 'YSSY', '2022-06-30 23:15:00+12', '2022-07-01 02:30:00+12', 15000);
  END IF;
END;
$do$
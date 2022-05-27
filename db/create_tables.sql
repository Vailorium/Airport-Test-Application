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

DO
$do$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM users) THEN
    /* username: test, password: asdfasdf */
    INSERT INTO users (display_name, username, password, salt)
    VALUES ('test', 'test', '8a333b2c806cb87fd21cd3db8bbb1746c1c2e400f72b1dfcae6b4ef84a32ee16', 'f94304f12e335d3e7e399538e947eab1');
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
    VALUES (1, 'NZNE', 'NZRO', '2022-06-01 10:30:00+12', '2022-06-01 11:00:00+12', 5000),
      (1, 'NZRO', 'YSSY', '2022-06-01 11:15:00+12', '2022-06-01 14:30:00+12', 15000);
  END IF;
END;
$do$
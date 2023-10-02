CREATE DATABASE rainbowdarkness;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE rainbows(
    rainbow_id SERIAL PRIMARY KEY,
    mood FLOAT(2, 1),
    createdAt TIMESTAMP with TIME ZONE,
    updatedAt TIMESTAMP with TIME ZONE,
    userID VARCHAR(255)
);
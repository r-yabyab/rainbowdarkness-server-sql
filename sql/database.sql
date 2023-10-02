CREATE DATABASE rainbowdarkness;

CREATE TABLE rainbows(
    rainbow_id SERIAL PRIMARY KEY,
    mood FLOAT(2, 2),
    createdAt TIMESTAMP with TIME ZONE,
    updatedAt TIMESTAMP with TIME ZONE,
    userID VARCHAR(255)
);
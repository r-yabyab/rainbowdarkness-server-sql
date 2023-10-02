CREATE DATABASE rainbowdarkness;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE rainbows(
    rainbow_id SERIAL PRIMARY KEY,
    -- rainbow_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    mood NUMERIC(3, 1),
    createdAt TIMESTAMP with TIME ZONE,
    updatedAt TIMESTAMP with TIME ZONE,
    userID VARCHAR(255)
);


-- \dt for table on psql terminal
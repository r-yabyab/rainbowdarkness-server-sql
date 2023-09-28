require('dotenv').config()

const express = require('express')
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PORT,
});

const app = express();

app.use(cors());
app.use(express.json());


// const express = require('express');
const mongoose = require('mongoose')
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PORT,
});

// const app = express();

// mongodb Schema

const Schema = mongoose.Schema

const rainbowSchema = new Schema ({
    // if user submits decimal, MongoDB stores as a Double
    // if whole number, Int32
    number: {
        type: Number,
        required: true
    },
    userID: {
        type: String
    },
    timeSlept: {
        type: Number
    },
    activities: {
        type: String
    },
    memo: {
        type: String
    },
}, {timestamps: true})
const mongooseModel = mongoose.model("Rainbow", rainbowSchema)

// get raw data from mongoDB
const rawData = mongoose.connect(process.env.MONG_URI).then(() => {
    
    const getAllRainbow = async (req, res) => {    
        const rainbows = await Rainbow.aggregate([
          {
            '$group': {
              '_id': '__v0', 
              'totalEntries': {
                '$count': {}
              }, 
              'avgPrice': {
                '$avg': '$number'
              }
            }
          }
        ])
        res.status(200).json(rainbows)
      }

})




// insert cleaned data into pg
const intoPostgres = async (req, res) => {
    const {number} = req.body

    try {
        const query = 'INSERT INTO rainbows (mood) VALUES $1';
        const values = [number];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ error: "server error"});
        }
        
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("some error", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// mongoose.connect(process.env.MONG_URI)
//     .then(() => {
//     })
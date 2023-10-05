// const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose')
const axios = require('axios');
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PORT,
});

// nginx points to postgres on /postgres/ on proxy_pass localhost:5432/;

// const app = express();

mongoose.connect(process.env.MONG_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB ERROR------', error)
})

db.once('open', () => {
    console.log('connected to mongodb');
});

// pool.connect();

// mongodb Schema

const Schema = mongoose.Schema

const rainbowSchema = new Schema ({
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
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
}, {timestamps: true})
// const mongooseModel = mongoose.model("Rainbow", rainbowSchema)
const Rainbow = mongoose.model('Rainbow', rainbowSchema)


// get raw data from mongoDB
    
    const getDataFromMongoDB = async () => {
        try{
            const data = await Rainbow.find().sort({ createdAt: 1 })
            console.log('access data')
            console.log(data + "DATA");
            console.log("length" + data.length)
            return data;
        } catch (error) {
            console.error("error fetching from mongoDB", error)
            throw error;
        }
}

// // insert cleaned data into pg
const insertDataIntoPostgreSQL = async (data) => {
    try {
        for (const entry of data) {
            const { number, userID, timeSlept, activities, memo, createdAt, updatedAt } = entry;

            const query = 'INSERT INTO rainbows (number, userID, timeSlept, activities, memo, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6, $7)';
            const values = [number, userID, timeSlept, activities, memo, createdAt, updatedAt];
    
            const { rows } = await pool.query(query, values);
    
            if (rows.length === 0) {
                // return res.status(404).json({ error: "server error"});
                console.error("failed to insert into postgres")
            }
        }
        console.log("Data insertion successful!")
    } catch (error) {
        console.error("some error", error);
        throw error;
    }
}

const sendDataToEndpoint = async (data) => {
    try {
        const response = await axios.post('https://stockshapes.net/postgres', data)
        console.log('data sent to endpoint');
    } catch (error) {
        console.error("error1", error)
        throw error;
    }
}

const main = async () => {
    try {
      const dataFromMongoDB = await getDataFromMongoDB();
      await insertDataIntoPostgreSQL(dataFromMongoDB);

      await sendDataToEndpoint(dataFromMongoDB);
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  };

  main();

//   // just for showing the data from mongoDB
//   getDataFromMongoDB();


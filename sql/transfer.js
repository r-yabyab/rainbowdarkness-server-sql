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

mongoose.connect(process.env.MONG_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB ERROR------', error)
})

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
// const mongooseModel = mongoose.model("Rainbow", rainbowSchema)
const Rainbow = mongoose.model('Rainbow', rainbowSchema)


// get raw data from mongoDB
// const rawData = mongoose.connect(process.env.MONG_URI).then(() => {
    
    const getLast = async () => {
        try{
            const data = await Rainbow.find().sort({ createdAt: -1 })
            return data;
        } catch (error) {
            console.error("error fetching from mongoDB", error)
            throw error;
        }
    //     const rainbowsLast = await Rainbow.aggregate([
    //       // created at -1 descending (most recent), limit for # of items
    //       {
    //         '$sort': {
    //           'createdAt': -1
    //         }
    //       }, 
    //       // {
    //       //   '$limit': 25
    //       // }
    //     ])
    //     res.status(200).json(rainbowsLast)
    //     console.log(rainbowsLast + "DATA")
    //   }

}




// insert cleaned data into pg
const intoPostgres = async (data) => {
    try {
        for (const entry of data) {
            const query = 'INSERT INTO rainbows (mood) VALUES $1';
            const values = [number];
    
            const { rows } = await pool.query(query, values);
    
            if (rows.length === 0) {
                return res.status(404).json({ error: "server error"});
            }
        }

        
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("some error", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PORT,
});

const postRainbow = async (req, res) => {
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
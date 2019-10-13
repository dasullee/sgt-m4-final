const express = require('express');
const PORT =  process.env.PORT || 9000;

const app = express();
const db = require('./db')

app.get('/api/test', async (req, res) => {
    const [result] = await db.query('SELECT * FROM grades');

    res.send({
        message: "Test route /api/test route working!",
        result
    })
})

app.listen(PORT, () => {
    console.log('Server listening at localhost:' + PORT);
});
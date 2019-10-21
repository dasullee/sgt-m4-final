const express = require('express');
const PORT =  process.env.PORT || 9000;

const app = express();
const db = require('./db')

app.use(express.json());

app.get('/api/test', async (req, res) => {
    const [result] = await db.query('SELECT * FROM grades');

    res.send({
        message: "Test route /api/test route working!",
        result
    })
});

app.get('/api/grades', async (req, res) => {
    const [records] = await db.query('SELECT pid, course, grade, name, updated AS lastUpdated FROM grades');

    res.send({
        records
    })
});

app.post('/api/grades', async (req, res, next) => {    
    try{
        const errors = [];
        const {course, grade, name} = req.body;
        if(grade < 0 || grade > 100){
            errors.push("The range for a possible grade is between 0 and 100, inclusive. Please try again.");
        }
        if(!grade){
            errors.push("No course grade received");
        }
        if(!course){
            errors.push("No course name received");
        }
        if(!name){
            errors.push("Student name not received");
        }
        if(errors.length > 0){
            res.status(422).send({
                code: 422,
                errors,
                message: "Bad POST Request"
            });
        } else{
            const [result] = await db.execute('INSERT INTO grades(pid, course, grade, name) VALUES (UUID(), ?,?,?)',[course, grade, name]);
            const [record] = await db.query('SELECT pid, course, grade, name, updated AS lastUpdated FROM grades WHERE id=?', [result.insertId]);
            res.send({
                message: "New student grade record created successfully",
                record
            });
        }
    }
    catch(err){
        res.send({
            message: "One of course, grade, or name incorrect!"
        })
    }
});

app.listen(PORT, () => {
    console.log('Server listening at localhost:' + PORT);
});
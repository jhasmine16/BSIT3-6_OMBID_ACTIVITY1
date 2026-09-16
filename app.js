const express = require('express');
const app =express();
const conn = require('./conn');
const fs = require('fs');

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/register', (req, res) => {
    try {
        const full_name     = req.body.full_name || req.body.fullname || '';
        const age           = req.body.age ? parseInt(req.body.age, 10) : 0;
        const gender        = req.body.gender || '';
        const birthdate     = req.body.birthdate || null;
        const address       = req.body.address || '';
        const contact_num   = req.body.contact_num || req.body.contact || '';
        const email         = req.body.email || '';
        const course        = req.body.course || '';
        const hobbies       = req.body.hobbies || '';
        
        // Extracted emergency contact number
        const emergency_num = req.body.emergency_num || req.body.emergencynum || '';
        
        const parsedYear    = parseInt(String(req.body.year_level || req.body.yearlevel || ''), 10);
        const year_level    = isNaN(parsedYear) ? 1 : parsedYear;
        
        // Updated INSERT query with emergency_num column and placeholder
        const insert = `
            INSERT INTO profiles 
            (full_name, age, gender, birthdate, address, contact_num, email, course, year_level, hobbies, emergency_num) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            full_name, age, gender, birthdate, address, 
            contact_num, email, course, year_level, hobbies, 
            emergency_num
        ];

        conn.query(insert, values, (err, result) => {
            if (err) {
                console.error('Database Insertion Error:', err);
                return res.status(500).send(`
                    <script>
                        alert('Database Error: Could not save profile.');
                        window.history.back();
                    </script>
                `);
            }

            res.send(`
                <script>
                    alert('Data Inserted Successfully!');
                    window.location.href = '/profiles';
                </script>
            `);
        });

    } catch (error) {
        console.error('Unexpected Server Error:', error);
        res.status(500).send('An unexpected error occurred.');
    }
});

app.get('/profiles', (req, res) => {
    const sql = 'SELECT * FROM profiles ORDER BY id DESC';

    conn.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching profiles:', err);
            return res.status(500).send('Database Error');
        }
        res.render('profiles', { profiles: results });
    });
});
app.listen(3000);
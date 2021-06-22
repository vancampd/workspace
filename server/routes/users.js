const router = require('express').Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4} = require('uuid');
require('dotenv').config();
const {JWT_SECRET} = process.env;

router
    .route('/register')
    .post((req, res) => {
        const {name, username, password} = req.body;

        // If any fields are missing, return
    if (!username || !password) {
        return res.status(400).send("Please enter the required fields.");
    }

    bcrypt
        .hash(password, 8)
        .then((hashedPassword) => {

            const userData = fs.readFileSync('./data/users.json')
            const users = JSON.parse(userData)

            const newUser = { name, username, password: hashedPassword, favorites:[]}

            users.push(newUser)

            fs.writeFileSync('./data/users.json', JSON.stringify(users))

        })
        .then(() => {
            res.status(201).send("Registered successfully");
        })
        .catch(() => {
            res.status(400).send("Failed registration");
        });
    })

router
    .route('/login')
    .post((req, res)=>{
        const {username, password} = req.body

        if(!username || !password){
            return res.status(400).send('Please enter all fields')
        }

        const userData = fs.readFileSync('./data/users.json')
        const users = JSON.parse(userData)

        const foundUser = users.find(user => user.username === username)

        if(!foundUser) return res.status(400).send('No user with that username was found')

        bcrypt.compare(password, foundUser.password).then(isPasswordCorrect => {
            if(!isPasswordCorrect) return res.status(400).send('Invalid Password')

            const token = jwt.sign(
                {name: foundUser.name, username: foundUser.username},
                JWT_SECRET,
                {expiresIn: '24h'}
            )

            res.json({token})
        })
        .catch(() => res.status(400).send('Incorrect Password') )
        

        

    })


module.exports = router;
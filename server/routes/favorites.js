const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const fs = require('fs');

router
    .route('/:name')
    .get((req, res) => {
        // console.log("Received favorites get request")

        // const favorites = getFavorites();

        // res.json(favorites);

        const {name} = req.params;

        const favorites = getUsersFavorites(name)

        res.json(favorites)
    })
    .post((req, res) => {
        // const favorites = getFavorites();

        // if(!favorites.some(favorite => favorite.id === req.body.id)){
        //     favorites.push(req.body)
        //     writeFavorite(favorites)

        //     return res.json(favorites)

        // } else {
        //     console.log('sending error')
        //     return res.status(400).json({ 'message': 'error posting favorite'})
        // }

        const {name} = req.params;

        const users = getUsers();
        const foundUser = users.find(user => user.name === name)

        const favorites = getUsersFavorites(name);

        if(!favorites.some(favorite => favorite.id === req.body.id)){
                favorites.push(req.body)

                users.forEach(user => {
                    if(user.name === name){
                        user.favorites = favorites
                    }
                })

                writeUserFavorites(users)
    
                return res.json(favorites)
    
            } else {
                console.log('sending error')
                return res.status(400).json({ 'message': 'error posting favorite'})
            }
    })
    .delete((req,res) => {
        // console.log(req.body)
        // const favorites = getFavorites();
        // const newFavorites = favorites.filter(favorite => favorite.id !== req.body.id)
        // writeFavorite(newFavorites)
        // return res.json(newFavorites)

        const {name} = req.params;

        // Get all users
        const users = getUsers();

        // Get the favorites for the user with the name in the request params
        const favorites = getUsersFavorites(name);

        // Remove the favorite with the id in the request body
        const newFavorites = favorites.filter(favorite => favorite.id !== req.body.id);

        // Set the favorites for the user with the name in the request body to the updated favorites
        users.forEach(user => {
            if(user.name === name){
                user.favorites = newFavorites
            }
        })

        writeUserFavorites(users)

        return res.json(newFavorites)

    })

// function getFavorites(){
//     const favoritesData = fs.readFileSync('./data/favorites.json')
//     const favorites = JSON.parse(favoritesData)
//     return favorites
// }

function getUsersFavorites(name){
    const userData = fs.readFileSync('./data/users.json')
        const users = JSON.parse(userData)
        const foundUser = users.find(user => user.name === name)

    return (foundUser.favorites)
}

function getUsers(name){
    const userData = fs.readFileSync('./data/users.json')
        const users = JSON.parse(userData)

    return (users)
}

// function writeFavorite(data){
//     fs.writeFileSync('./data/favorites.json', JSON.stringify(data))
//     console.log('New favorite added to favorites.json')
// }

function writeUserFavorites(data){
    fs.writeFileSync('./data/users.json', JSON.stringify(data))
    console.log('New favorite added to favorites.json')
}

module.exports = router;
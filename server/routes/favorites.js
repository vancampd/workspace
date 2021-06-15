const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const fs = require('fs');

router
    .route('/')
    .get((req, res) => {
        console.log("Received favorites get request")

        const favorites = getFavorites();

        res.json(favorites);
    })
    .post((req, res) => {
        const favorites = getFavorites();

        if(!favorites.some(favorite => favorite.id === req.body.id)){
            favorites.push(req.body)
            writeFavorite(favorites)

            return res.json(favorites)

        } else {
            console.log('sending error')
            return res.status(400).json({ 'message': 'error posting favorite'})
        }

        
    })
    .delete((req,res) => {
        console.log(req.body)
        const favorites = getFavorites();
        const newFavorites = favorites.filter(favorite => favorite.id !== req.body.id)
        writeFavorite(newFavorites)
        return res.json(newFavorites)
    })

function getFavorites(){
    const favoritesData = fs.readFileSync('./data/favorites.json')
    const favorites = JSON.parse(favoritesData)
    return favorites
}

function writeFavorite(data){
    fs.writeFileSync('./data/favorites.json', JSON.stringify(data))
    console.log('New favorite added to favorites.json')
}

module.exports = router;
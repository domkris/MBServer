const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Game = require('../models/Game');

// GET ALL GAMES
router.get('/', async (req, res) => {
    try
    {
        const allGames = await Game.find();
        res.json(allGames);
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

// GET A SPECIFIC GAME
router.get('/:createdBy', async (req, res) => {
    try
    {
        const foundGame = await Game.find({ createdBy :req.params.createdBy });
        if(foundGame.length !== 0){
            res.json({success : true, games: foundGame});
        }else {
            res.json({success: false, message: "No games found for this user!"});
        }
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

// JOIN A GAME
router.post('/joinGame', async (req, res) => {
    try
    {
        const foundGame = await Game.find({ name : req.body.gameName });
        if(foundGame[0]){
            var password = foundGame[0].password;
            if(await bcrypt.compare(req.body.gamePassword, password)){
                res.json({success: true, gameData:foundGame});

            }else {
                res.json({message:"Wrong game name or password !", success: false});
            }
        }else {
            res.json({ message: "Wrong game name or password !", success: false});
        }
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

// POST/CREATE A GAME
router.post('/', async (req, res) => {

    Game.findOne({ name :req.body.gameName })
    .then(game => {
        if(game){
            res.json({message:"Choose another game name !", success: false});
        }else{
            const newGame = new Game({
                timeCreated: Date.now(),
                password: req.body.gamePassword,
                createdBy: req.body.createdBy,
                amount: req.body.gameAmount,
                name: req.body.gameName
            });

            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(newGame.password, salt, (err,hash) => {
                    if(err){
                        console.log("error");
                        throw err
                    }else{
                        newGame.password = hash;
                        newGame.save()
                            .then(game => {
                                res.json({success: true, gameData: game})
                            })
                            .catch(err => console.log(err));
                    }
                });
            });
        }
    });
    // console.log("hej");
    // console.log(req.body);
    // const newGame = new Game({
    //     timeCreated: Date.now(),
    //     password: req.body.gamePassword,
    //     createdBy: req.body.createdBy,
    //     amount: req.body.gameAmount,
    //     name: req.body.gameName
    // });
    // try
    // {
    //     const savedGame = await newGame.save();
    //     console.log(savedGame);
    //     res.json({success : "true",savedGame});
    // }
    // catch(error)
    // {
    //     res.json({ message: error });
    // }
    // Game.findOne({ createdBy :req.body.createdBy })
    // .then(game => {
    //     if(game){
    //         return res.status(400).json({message:"User can create only ONE game!", success: false});
    //     }else{
    //         const newUser = new User({
    //             username : req.body.username,
    //             password : req.body.password

    //         });

    //         bcrypt.genSalt(10, (err,salt) => {
    //             bcrypt.hash(newUser.password, salt, (err,hash) => {
    //                 if(err){
    //                     throw err
    //                 }else{
    //                     newUser.password = hash;
    //                     newUser.save()
    //                         .then(user => {
    //                             res.json({success: true, userData: user})
    //                             console.log(user);
    //                         })
    //                         .catch(err => console.log(err));
    //                 }
    //             });
    //         });
    //     }
    // })
})
// DELETE A GAME
router.delete('/:gameId', async (req, res) => {
    try
    {
        const aGame = await Game.remove( {_id : req.params.gameId });
        res.json(aGame);
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

// UPDATE A GAME
router.patch('/:gameId', async (req, res) => {
    try
    {
        const updatedGame = await Game.updateOne( 
            {_id : req.params.gameId },
            {$set : 
                {
                    timeCreated : Date.now()
                }
            }
        );
        res.json(updatedGame);
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');

// GET ALL USERS
router.get('/', async (req, res) => {
    try
    {
        const allUsers = await User.find();
        res.json(allUsers);
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

// GET A SPECIFIC USER
router.get('/:username', async (req, res) => {
    try
    {
        const aUser = await User.find({ username: req.params.username});
        res.json(aUser);
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

// POST/CREATE A USER
router.post('/', async (req, res) => {
    User.findOne({ username:req.body.username })
    .then(user => {
        if(user){
            res.json({message:"Choose another username !", success: false});
        }else{
            const newUser = new User({
                username : req.body.username,
                password : req.body.password

            });
            

            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err){
                        console.log("error");
                        throw err
                    }else{
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                res.json({success: true, userData: user})
                            })
                            .catch(err => console.log(err));
                    }
                });
            });
        }
    })
})

// DELETE A USER
router.delete('/:userId', async (req, res) => {
    try
    {
        const aUser = await User.find({ username : req.body.username});
         if(!aUser[0]) {
            res.json({ message: "Wrong username or password !", success: false});
         }
         else {
             if(await bcrypt.compare(req.body.admin, "true7")){

                const aUser = await User.remove( {_id : req.params.userId });
                 res.json({success: true, userData: aUser});

             }else {
                 res.json({message:"Wrong username or password !", success: false});
             }
         }     
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

// UPDATE A USER
router.patch('/:userId', async (req, res) => {
    try
    {
        const updatedUser = await User.updateOne( 
            {_id : req.params.userId },
            {$set : 
                {
                    password : req.body.password
                }
            }
        );
        res.json(updatedUser);
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

// LOGIN USER
router.post('/login', async (req, res) => {
    
    try
    {
        const aUser = await User.find({ username : req.body.username});
         if(!aUser[0]) {
            res.json({ message: "Wrong username or password !", success: false});
            console.log("Wrong username or password ! " + aUser);
         }
         else {
             if(await bcrypt.compare(req.body.password, aUser[0].password)){
                 res.json({success: true, userData: aUser[0]});

             }else {
                 res.json({message:"Wrong username or password !", success: false});
             }
         }     
    }
    catch(error)
    {
        res.json({ message: error });
    }
})

module.exports = router;
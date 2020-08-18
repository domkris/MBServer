const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("routers/home.js");
})




module.exports = router;
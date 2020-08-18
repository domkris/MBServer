const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, gameUsers, getUserByName, updateUser} = require('./utils/users');

io.on("connection", socket => {

    // show in server console user connected
    console.log(new Date().toLocaleTimeString() + "   user connected: ", socket.id);

    // Separate chat by GAMES
    socket.on("joinRoom", ({username, game, gameAmount}) => {

        const user = userJoin(socket.id, username, game, gameAmount);
        console.log("GAME: " + user.game);
        socket.join(user.game);

        // Welcome current user
        socket.emit("welcomeMessage", formatMessage("BOT",`Welcome to the game ${username}`));

        // broadcast to the users a new connected user, (broeadcast to the everybodyexcept a user that is connecting)
        socket.broadcast.to(user.game).emit("message", `${username} has joined the game`);

         // broadcast to users all users in the same game
        io.to(user.game).emit("usersInGame", {users : gameUsers(user.game)});
    })

  
    //listen for gameMessage and console to the server
    socket.on("gameMessage", (message) => {
        
        console.log(message);
        // find the current user
        const user = getCurrentUser(socket.id);
        const userGivingMoney = getUserByName(message.username);
        const money = message.text;
        const userReceivingMoney = getUserByName(message.otherUser);
        updateUser(userGivingMoney.username, money);
        updateUser(userReceivingMoney.username, money);
        // emit to the other users in the same game
        io.to(user.game).emit("gameMessage", formatMessage(message.username, message.text, message.otherUser));
    });

    


    // show in server console user disconnected
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if(user){
            // broadcast to the users in the game that a user has left the game
            io.to(user.game).emit("message", `A ${user.username} has left the game`);

            console.log(new Date().toLocaleTimeString() + '  user disconnected...', user.username);
 
            // broadcast to users all users in the same game
            io.to(user.game).emit("usersInGame", {users : gameUsers(user.game)});
        }
    });

    socket.on('error', function (err) {
        console.log(err)
    })
});
require('dotenv').config();


// IMPORT ROUTES
const userRouter = require('./routes/users');
const gameRouter = require('./routes/games');
const bankRouter = require('./routes/banks');
const homeRouter = require('./routes/home');

//MIDDLEWARE for ROUTES and PARSER
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// CORS MIDDLEWARE jer maltretira sve zivo
app.use(cors());

app.use('/users', userRouter);
app.use('/games', gameRouter);
app.use('/banks', bankRouter);
app.use('/home', homeRouter);
app.use('/', homeRouter);




// HOME ROUTE
app.get('/', (req, res) => {
    res.send('We are on home');
});

// DB CONNECTION
mongoose.connect(process.env.DB_CONN,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log('Connected to Mongo!');
})
.catch((err) => {
    console.error('Error connecting to Mongo', err);
});

// listening to the server and port
server.listen(3002);
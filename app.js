const http = require('http');
const PORT = process.env.PORT || 3002;// HEROKU specified port or localhost
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, gameUsers, getUserByName, updateGivingUser, updateReceivingUser} = require('./utils/users');

io.on('connection', socket => {

    // show in server console user connected
    console.log("------------------------USER-CONNECTED---------------------------");
    console.log(new Date().toLocaleTimeString() + "   user connected: ", socket.id);

    // Separate chat by GAMES
    socket.on("joinRoom", ({username, game, gameAmount}) => {
        console.log("-------JOIN ROOM-----------------");
        const user = userJoin(socket.id, username, game, gameAmount);
        socket.join(user.game);
        
        // Welcome current user
        socket.emit("welcomeMessage", formatMessage("message", "BOT",`Welcome to the game ${username}`));
        
        // broadcast to the users a new connected user, (broeadcast to the everybodyexcept a user that is connecting)
        socket.broadcast.to(user.game).emit("gameMessage",formatMessage("userStatus", username, `Joined the game`, null));
        
        // broadcast to users all users in the same game
        io.to(user.game).emit("usersInGame", {users : gameUsers(user.game)});
    })
    
    // show in server console user disconnected
    socket.on("disconnect", () => {
        console.log("disconect");
        const user = userLeave(socket.id);
        console.log("user " + user);
        if(user){
            // broadcast to the users in the game that a user has left the game
            //io.to(user.game).emit("message", `A ${user.username} has left the game`);
            io.to(user.game).emit("gameMessage", formatMessage("userStatus", user.username, `Left the game`, null));

            console.log(new Date().toLocaleTimeString() + '  user disconnected...', user.username);
 
            // broadcast to users all users in the same game
            io.to(user.game).emit("usersInGame", {users : gameUsers(user.game)});
        }
    });
    
       //listen for chat and console to the server
    socket.on("chat", (message) => {
        // find the current user
        const user = getCurrentUser(socket.id);

        // emit to the other users in the same game
        io.to(user.game).emit("chat", formatMessage("chat", message.username, message.text));

    });

    //listen for transaction and console to the server
    socket.on("transaction", (message) => {
        console.log(message);
        const user = getCurrentUser(socket.id);
        const userGivingMoney = getUserByName(message.username);
        const money = message.amountArray;
        const userReceivingMoney = getUserByName(message.otherUser);
        console.log(userGivingMoney);
        updateGivingUser(userGivingMoney.username, money);
        updateReceivingUser(userReceivingMoney.username, money);

        io.to(user.game).emit("transaction", formatMessage("transaction", message.username, money, message.otherUser));

        // emit to the other users in the same game all users and their new amounts
        io.to(user.game).emit("usersAfterTransaction", {users: gameUsers(user.game)});
    });

     //listen for request to get money from the bank and console to the server
    socket.on("fromBankTransaction", (message) => {
        console.log(message);
        const user = getCurrentUser(socket.id);
        const money = message.amountArray;
        const userReceivingMoney = getUserByName(message.username);
        updateReceivingUser(userReceivingMoney.username, money);

        io.to(user.game).emit("fromBankTransaction", formatMessage("fromBankTransaction", message.username, money));

        // emit to the other users in the same game all users and their new amounts
        io.to(user.game).emit("usersAfterTransaction", {users: gameUsers(user.game)});
    });

       //listen for request to send money to the bank and console to the server
       socket.on("toBankTransaction", (message) => {
        console.log(message);
        const user = getCurrentUser(socket.id);
        const money = message.amountArray;
        const userGivingMoney = getUserByName(message.username);
        updateGivingUser(userGivingMoney.username, money);

        io.to(user.game).emit("toBankTransaction", formatMessage("toBankTransaction", message.username, money));

        // emit to the other users in the same game all users and their new amounts
        io.to(user.game).emit("usersAfterTransaction", {users: gameUsers(user.game)});
    });


    socket.on("userLeftGame", () => {
        const user = userLeave(socket.id);
        console.log("user " + user);

        if(user){
            // broadcast to the users in the game that a user has left the game
            io.to(user.game).emit("gameMessage", formatMessage("userStatus", user.username, `Left the game`, null));
 
            // broadcast to users all users in the same game
            io.to(user.game).emit("usersInGame", {users : gameUsers(user.game)});
        }
    });

    socket.on("userLogOut", () => {
        const user = userLeave(socket.id);
        console.log("user " + user);

        if(user){

            // broadcast to the users in the game that a user has left the game
            io.to(user.game).emit("gameMessage", formatMessage("userStatus", user.username, `Left the game`, null));
 
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
server.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`)
});
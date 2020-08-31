const users = [];

// join user to chat

function userJoin(id, username, game, amount){
    const user = {id, username, game, amount};
    console.log(user);
    users.push(user);

    return user;
}



function getCurrentUser(id){
    return users.find(user => user.id===id);
}

function updateGivingUser(name, money){
    var index = users.map(user => user.username).indexOf(name);
    users[index].amount = parseInt(users[index].amount) - parseInt(money);
    console.log(users[index]);
}
function updateReceivingUser(name, money){
    var index = users.map(user => user.username).indexOf(name);
    users[index].amount = parseInt(users[index].amount) + parseInt(money);
    console.log(users[index]);
}

function getUserByName(name){
    return users.find(user => user.username === name);
}

function userLeave(id){
    console.log(id);
    const index = users.findIndex(user => user.id === id);
    if(index != -1) {
        return users.splice(index,1)[0];
    }
}

function gameUsers(game){
    return users.filter(user => user.game === game);
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    gameUsers,
    getUserByName,
    updateGivingUser,
    updateReceivingUser
};
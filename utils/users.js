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

function updateUser(name, money){
    users.forEach(element => {
        console.log(element.index);
    });
    console.log(name + " " + money);
    //users[index].amount += money;
}

function getUserByName(name){
    return users.find(user => user.username === name);
}

function userLeave(id){
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
    updateUser
};
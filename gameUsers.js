const gameUsers = [];

const addUser = ({id, name, game}) => {
    const user = {id, name, game}
    gameUsers.push(user);

    return {user}
};

const removeUser = (id) => {
    const index = gameUsers.findIndex((user) => user.id == id);
    if(index != -1){
        return gameUsers.splice(index, 1)[0]
    }
};

const getUsersInGame = (game) => { gameUsers.filter((user) => user.game === game)

};

module.exports = {addUser, removeUser, getUsersInGame};


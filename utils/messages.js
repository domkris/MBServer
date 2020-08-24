const moment = require('moment');

function formatMessage(type, username, text, otherUser){
    if(username == "BOT"){
        return({
            type,
            username : "MonopolBank Bot",
            text,
            time: moment().format('h:mm')
        });
    }
    else 
    {
        return({
            type,
            username,
            text,
            time: moment().format('h:mm'),
            otherUser
        });
    }
}


module.exports = formatMessage;
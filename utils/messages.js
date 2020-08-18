const moment = require('moment');

function formatMessage(username, text, otherUser){
    if(username == "BOT"){
        return({
            username : "MonopolBank Bot",
            text,
            time: moment().subtract(0, 'days').calendar()
        });
    }
    else 
    {
        return({
            username,
            text,
            time: moment().format('h:mm:ss a'),
            otherUser
        });
    }
}


module.exports = formatMessage;
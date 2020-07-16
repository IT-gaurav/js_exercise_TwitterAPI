const Twitter = require('twitter');

module.exports = (app, io) => {
    let twitter = new Twitter({
        consumer_key: 'r9kC2lawkyGQOFLHOoGo5hvFk',
        consumer_secret: 'nE0gWR2dnAeqdK48G4a72tK9zLRKDAEWPWyJXZ7Nl79diusuPi',
        access_token_key: '1283525867776475138-9YGkFCekFlyg52nAtVkGCr189JG6oD',
        access_token_secret: '99V7U0IQrPOTYz1DsniNiMkf5yy5lWpIqHuZ2im16aAPN'
    });

    let socketConnection;
    let twitterStream;

    app.locals.searchTerm = 'trump'; //Default search term for twitter stream.
    app.locals.showRetweets = false; //Default

    /**
     * Resumes twitter stream.
     */
    const stream = (t = 'trump') => {
        console.log('Resuming for ' + t);
        twitter.stream('statuses/filter', { track: t }, (stream) => {
            stream.on('data', (tweet) => {
                sendMessage(tweet);
            });

            stream.on('error', (error) => {
                console.log(error);
            });

            twitterStream = stream;
        });
    }


    // Sets search term for twitter stream.

    app.post('/setSearchTerm', (req, res) => {
        let term = req.body.term;
        twitterStream.destroy();
        stream(term);
    });

    // connection.
    io.on("connection", socket => {
        socketConnection = socket;
        stream();
        socket.on("connection", () => console.log("Client connected"));
        socket.on("disconnect", () => console.log("Client disconnected"));
    });

    /**
     * Emits data from stream.
     * @param {String} msg 
     */
    const sendMessage = (msg) => {
        if (msg.text.includes('RT')) {
            return;
        }
        socketConnection.emit("tweets", msg);
    }
};
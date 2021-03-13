const http = require("http");
const request = require("request");
const { getRandomMeme } = require("@blad3mak3r/reddit-memes");

const options = {
    reddit: ["programmingmemes", "ProgrammerHumor", "programming_memes", "codinghumor"],
    host: "localhost",
    port: 80
}

function startServer() {
    let server = http.createServer(processRequest);
    server.listen(options.port, options.host, () => {
        console.log(`Started the server at http://${options.host}:${options.port}`)
    })
}

async function processRequest(request, response) {
    const meme = await requestMeme();
    response.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "no-cache" });
    response.end(meme, 'binary');
}

async function requestMeme(callback) {
    const randomMeme = await getRandomMeme(options.reddit.randomElement());
    console.log(`Processing meme: ${randomMeme.title} at reddit ${randomMeme.subreddit} url: ${randomMeme.image}`)
    return await get(randomMeme.image, { encoding: "binary" })
}

async function get(url, options) {
    return new Promise(function(resolve, reject) {
        request.get(url, options, function(error, response) {
            error ? reject(error) : resolve(response.body);
        });
    });
}

Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random()* this.length)];
}

startServer();
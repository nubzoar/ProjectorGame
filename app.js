let http = require('http');
let fs = require('fs');
let url = require('url');
let path = require('path');

const port = 8080;

let server = http.createServer(function (req, res) {

    let uri = url.parse(req.url).pathname;
    let filename = path.join(process.cwd(), uri);

    /*
    // Remove comment for verbose uri logging.
    let array = uri.match(/[/](\w+)/g);
    if (array) {
        for (let i = 0; i < array.length; i++) {
            console.log(array[i]);
        }
    }
    */

    if (req.url === '/') {

        res.writeHead(200, { 'Content-Type' : 'text/html' });
        fs.createReadStream('index.html').pipe(res)
    }

    else if (uri.match(/[/](\w+)/)[1] === 'game') {
        
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        fs.createReadStream('game.html').pipe(res)
    }

    else if (uri.match(/[/](\w+)/)[1] === 'css') {
        fs.exists(filename, function(exists) {
            if (!exists) {
                console.log("Css doesn't exist: " + req.url);
                return404();
            } else {
                res.writeHead(200, { 'Content-Type' : 'text/css' });
                fs.createReadStream(filename).pipe(res);
            }
        });
    }

    else if (uri.match(/[/](\w+)/g)[0] === '/js' && uri.match(/[/](\w+)/g)[1] === '/client') {
        fs.exists(filename, function(exists) {
            if (!exists) {
                console.log("Client javascript doesn't exist: " + req.url);
                return404();
            } else {
                res.writeHead(200, { 'Content-Type' : 'text/javascript' });
                fs.createReadStream(filename).pipe(res);
            }
        });
    }

    // Currently only serves .pngs
    // TO DO: Write logic to detect file type and write http header with correct mime type.
    else if (uri.match(/[/](\w+)/)[1] === 'images') {
        fs.exists(filename, function(exists) {
            if (!exists) {
                console.log("Image doesn't exist: " + req.url);
                return404();
            } else {
                res.writeHead(200, { 'Content-Type' : 'image/png' });
                fs.createReadStream(filename).pipe(res);
            }
        });
    }

    else {
        console.log("Else reached, here is request url: " + req.url);
        return404(res);
    }

})

function return404(res) {
    res.writeHead(200, { 'Content-Type' : 'text/plain' });
    res.write('Error 404: Not Found');
    res.end();
}
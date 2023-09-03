// @deno-types="npm:@types/express@^4"
import express, { Express, Request, Response } from "npm:express@^4";
import morgan from "npm:morgan@^1";
import "npm:pug@^3";
// @deno-types="npm:@types/entities@^1"
import { encodeXML } from 'npm:entities@^1'; 

const app: Express = express();

app.set('views', './views-lab6');
app.set('view engine', 'pug');
app.locals.pretty = app.get('env') === 'development';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req: Request, res: Response) {
    res.render('index');
});

app.all('/submit', function (req: Request, res: Response) {
    let name = req.method === 'GET' ? req.query.name : req.body.name;
    console.log('---------------------------');
    console.log('\x1B[35mreq.query\x1B[0m =', req.query);
    console.log('\x1B[35mreq.body\x1B[0m  =', req.body);
    console.log('\x1B[35mname\x1B[0m      =', name);

    // Return the greeting in the format preferred by the WWW client
    switch (req.accepts(['html', 'text', 'json', 'xml'])) {
        case 'json':
            // Send the JSON greeting
            res.type('application/json');
            res.json({ welcome: `Hello '${name}'` });
            console.log(`The server sent a \x1B[31mJSON\x1B[0m document to the browser for the request below`);
            break;
        case 'xml':
            // Send the XML greeting
            name = name !== undefined ? encodeXML(name) : '';
            res.type('application/xml');
            res.send(`<welcome>Hello '${name}'</welcome>`);
            console.log(`The server sent an \x1B[31mXML\x1B[0m document to the browser for the request below`);
            break;
        default:
            // Send the text plain greeting
            res.type('text/plain');
            res.send(`Hello '${name}'`);
            console.log(`The server sent a \x1B[31mplain text\x1B[0m document to the browser for the request below`);
    }
});

app.listen(8000, function () {
    console.log('The server was started on port 8000');
    console.log('To stop the server, press "CTRL + C"');
});

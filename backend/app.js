require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Imap = require('imap'),
    inspect = require('util').inspect;


const app = express();

app.use(cors());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/',(req,res) => {
    res.send("App is running\n");
});

app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method\n');
});

app.post('/test', (req, res) => {
    const one = 1;
    const message = {
        one, 
        text: "hohoho",
        userId: 123,
        };
    return res.send(message);
});

app.post('/tests', (req, res) => {
    const one = 1;
    const messages = []
    const message = {
        one, 
        text: "hohoho",
        userId: 123,
      };
      messages.push(message);
      messages.push(message);
      messages.push(message);
    return res.send(messages);
});

app.post('/mails', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const imap = new Imap({
        user: email,
        password: password,
        host: 'imap.gmail.com',
        port: 993,
        tls: true
    });

    const openInbox = (cb) => {
        imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function() {        
        openInbox(function(err, box) {
            let messages = [];
            if (err) throw err;
            var f = imap.seq.fetch(box.messages.total-4+':*', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true
            });
            f.on('message', function(msg, seqno) {            
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function(stream, info) {
                    var buffer = '';
                    stream.on('data', function(chunk) {
                    buffer += chunk.toString('UTF-8');
                    });
                    stream.once('end', function() {
                        const seqnum = seqno;
                        const from = Imap.parseHeader(buffer).from[0];
                        const date = Imap.parseHeader(buffer).date[0];
                        const subject = Imap.parseHeader(buffer).subject[0];

                        const message = {
                            seqnum,
                            date,
                            from,
                            subject
                        }
                        messages.push(message);
                    });
                });
                msg.once('attributes', function(attrs) {
                });
                msg.once('end', function() {
                });
            });
            f.once('error', function(err) {
                return res.send('Error dalam pengambilan surel : ' + err);
            });
            f.once('end', function() {                
                imap.end();
                messages = messages.reverse();
                return res.send(messages);
            });
        });
    });
      
    imap.once('error', function(err) {
        return res.send('Error dalam pengambilan surel : ' + err);
    });
      
    imap.once('end', function() {        
    });
      
    imap.connect();
    const response = {
        email,
        password
    }    
});

app.listen(process.env.PORT, () => {
    console.log(`App listen on port ${process.env.PORT}`)
})


var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'mahdiarnaufal@gmail.com',
  password: 'mahdiarnaufal13',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    let amountEmail = 5;
    var f = imap.seq.fetch(box.messages.total-(amountEmail-1) + ':' + box.messages.total , { bodies: ['HEADER.FIELDS (FROM)','TEXT'] });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        if (info.which === 'TEXT')
          console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
        var buffer = '', count = 0;
        stream.on('data', function(chunk) {
          console.log(chunk.toString('utf8'));
          count += chunk.length;
          buffer += chunk.toString('utf8');
          if (info.which === 'TEXT')
            console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
        });
        stream.once('end', function() {
          if (info.which !== 'TEXT')
            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
          else
            console.log(prefix + 'Body [%s] Finished', inspect(info.which));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect();
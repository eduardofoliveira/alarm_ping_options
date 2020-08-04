const sip = require('sip');
const udp = require('dgram');

sip.start({}, function(rq) { sip.send(sip.makeResponse(rq, 500)); });
var socket = udp.createSocket('udp4');
socket.bind(6060);

function test1() {
  socket.on('message',function(msg, rinfo) {
    var rs = sip.stringify(sip.makeResponse(sip.parse(msg), 200));
    socket.send(new Buffer(rs), 0, rs.length, rinfo.port, rinfo.address);
  });

  setInterval(() => {
    sip.send(
      {
        method: 'OPTIONS',
        uri: 'sip:179.54.23.33:5060;transport=udp',
        via:
            [ { params: { branch: 'z9hG4bK697446', rport: null } }],
           'max-forwards': '70',
        headers: {
          cseq: {method: 'OPTIONS', seq:1},
          'call-id': 'hrbtch',
          to: {uri: 'sip:mod_sofia@179.54.23.33'},
          from: {uri: 'sip:mod_sofia@179.54.23.33'},
        }
      },
      function(rs) {
        console.log(rs.status)
      }
    );
  }, 5000);
}

test1()
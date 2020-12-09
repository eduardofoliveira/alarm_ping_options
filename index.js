const nodemailer = require('nodemailer');
const sip = require('sip');
const udp = require('dgram');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eduardo@cloudcom.com.br',
    pass: '190790edu'
  }
});

let statusAtual = 408;
let tentativas = 0;

sip.start({port: 6061}, function(rq) { sip.send(sip.makeResponse(rq, 500)); });
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
        if(statusAtual !== rs.status){
          statusAtual = rs.status
        }

        if(statusAtual === rs.status){
          tentativas + tentativas + 1;
        }

        if(tentativas === 5){
          const mailOptions = {
            from: 'suporte@cloudcom.com.br',
            to: 'suporte.basix@cloudcom.com.br',
            subject: 'Status do DirectConnect Alterado',
            text: `Status da reposta ${rs.status}`
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            // console.log(error);
            } else {
              // console.log('Email sent: ' + info.response);
            }
          });
        }
      }
    );
  }, 5000);
}

test1()
const server = require('http').createServer();
const socket = require('socket.io')(server);


socket.on('connection', sc => {
  sc.once('enterRoom', (msg, ack) => {
      try {
        if (typeof msg !== 'object' || !msg.name || typeof msg.name !== 'string') {
          sc.disconnect();
          return;
        }
        if (msg.roomId && sc.rooms) {
          sc.leave(Object.keys(sc.rooms)[0], () => {
          });
        }
        let roomId = msg.roomId || Object.keys(sc.rooms)[0];
        let {name} = msg;
        sc.name = name;
        sc.roomId = roomId;
        sc.join(roomId, () => {
          socket.to(roomId).emit('newUser', {name, id: sc.id});
          ack({
            roomId,
            users: getUsersInRoom(roomId, sc.id),
            name: msg.name
          });
        });
      } catch (e) {
        console.log(e);
        sc.disconnect();
      }
    }
  );

  sc.on('addMessage', msg => {
    try {
      if (typeof msg !== 'object' || !msg.text || typeof msg.text !== 'string') {
        sc.disconnect();
        return;
      }
      socket.to(sc.roomId).emit('newMessage', {text: msg.text, userId: sc.id, userName: sc.name, date: (new Date()).toLocaleString(), id: Math.floor(Math.random() * 10000000)});
    } catch (e) {
      console.log(e);
      sc.disconnect();
    }
  });

  sc.on('offer', msg => {
    try {
      if (typeof msg !== 'object' || !msg.to || !msg.offer) {
        sc.disconnect();
        return;
      }
      let client = socket.sockets.connected[msg.to];
      if (!client || client.id == sc.id) return;
      client.emit('offerReq', {from: sc.id, offer: msg.offer});
    } catch (e) {
      console.log(e);
      sc.disconnect();
    }
  });

  sc.on('answer', msg => {
    try {
      if (typeof msg !== 'object' || !msg.to || !msg.answer) {
        sc.disconnect();
        return;
      }
      let client = socket.sockets.connected[msg.to];
      if (!client || client.id == sc.id) return;
      client.emit('answerReq', {from: sc.id, answer: msg.answer});
    } catch (e) {
      console.log(e);
      sc.disconnect();
    }
  });


  sc.on("disconnect", () => {
    try {
      if (sc.roomId && sc.name) {
        sc.leave(sc.roomId, () => {
          socket.to(sc.roomId).emit('userLeaved', {name: sc.name, id: sc.id});

        });
      }
    } catch (e) {
      console.log(e);
    }
  });
});

function getUsersInRoom(roomId) {
  let res = [];
  for (let userId in socket.sockets.connected) {
    let user = socket.sockets.connected[userId];
    if (user.rooms[roomId]) {
      res.push({id: user.id, name: user.name});
    }
  }
  return res;
}

module.exports = server;



const app = require('./src');
const turn = require('./src/turn');
const {port} = require('./config')[process.env.NODE_ENV].ws;
turn.start();
app.listen(port, () => {
  console.log(`App started on ${port}`)
});


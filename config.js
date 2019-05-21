module.exports = {
  dev: {
    turn:{
      port: 5432,
      authMech: 'long-term',
      debug: 'INFO',
      ips: ['127.0.0.1'],
      users: {
        "admin1" : "badboy"
      }
    },
    ws: {
      port: 3001
    }
  }
};

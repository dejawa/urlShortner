
module.exports = {
    postgres: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',     
        password: process.env.DB_PW || 'password',
        database: process.env.DB_DB ||  'urls',
        port: 5432,
    }
  };
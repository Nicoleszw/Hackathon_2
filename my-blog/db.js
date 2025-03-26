const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'blogdb',
  password: 'nicole123',
  port: 5432,
});

module.exports = pool;

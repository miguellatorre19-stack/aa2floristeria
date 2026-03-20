const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const knex = require('knex');
const { use } = require('react');

const db=knex({
  client: 'sqlite3',
  connection: {
    filename: 'floristeria.db'
  },
  useNullAsDefault: true
});

app.use(cors());
app.use(express.json());
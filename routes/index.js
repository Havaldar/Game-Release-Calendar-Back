const express = require('express');
const router = express.Router();

/* postgres library for querying db. */
const knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    host : '127.0.0.1',
    user : 'abhinav',
    database : 'games'
  }
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/games', function(req, res, next) {
    knex.transaction(tx => {
        knex('plant')
            .transacting(tx)
            .select('name')
            .then(resp => res.json({response: resp}));
    });
});

module.exports = router;

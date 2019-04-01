const express = require('express');
const router = express.Router();

/* postgres library for querying db. */
const knex = require('knex')({
  client: 'sqlite3',
  version: '7.2',
  connection: {
    filename: "./dev.sqlite3"
  }
});


router.get('/', function(req,res, next){
  res.send("API is working");
});





/* GET home page. */
router.get('/originalHome', function(req, res, next) {
  console.log();
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

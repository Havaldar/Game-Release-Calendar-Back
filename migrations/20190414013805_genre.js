
exports.up = function(knex, Promise) {
  	return Promise.all([
        // creates table for genre
        knex.schema.createTable('genre', (table) => {
            table.string('id').primary()
            table.string('name')
            table.index('name', 'genre_name_idx')
        }),
        // creates table for game_platform
        knex.schema.createTable('game_genre', (table) => {
            table.string('game_id').references('game.id')
            table.string('genre_id').references('genre.id')
        })
    ]);
};

exports.down = function(knex, Promise) {
  	return Promise.all([
        knex.schema.dropTable('genre'),
        knex.schema.dropTable('game_genre')
    ]);
};

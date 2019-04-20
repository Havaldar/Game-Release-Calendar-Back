
exports.up = function(knex, Promise) {
    return Promise.all([
        // creates table for games
        knex.schema.createTable('game', (table) => {
            table.string('id').primary()
            table.string('name')
            table.text('deck')
            table.text('summary')
            table.text('cover')
            table.date('first_release_date')
            table.index('name', 'game_name_idx')
            table.index('first_release_date', 'game_first_release_date_idx')
        }),
        // creates table for platform
        knex.schema.createTable('platform', (table) => {
            table.string('id').primary()
            table.string('name')
            table.index('name', 'platform_name_idx')
        }),
        // creates table for game_platform
        knex.schema.createTable('game_platform', (table) => {
            table.string('game_id').references('game.id')
            table.string('platform_id').references('platform.id')
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('game'),
        knex.schema.dropTable('platform'),
        knex.schema.dropTable('game_platform')
    ]);
};

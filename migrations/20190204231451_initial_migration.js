
exports.up = function(knex, Promise) {

    // creates table for games
    knex.schema.createTable('game', (table) => {
        table.string('guid').primary()
        table.string('name')
        table.text('deck')
        table.text('description')
        table.date('expected_release_date')
        table.text('image_url')
        table.date('original_release_date')
        table.index('name', 'game_name_idx')
        table.index('expected_release_date', 'game_expected_release_date_idx')
        table.index('original_release_date', 'game_original_release_date_idx')
    });

    // creates table for platform
    knex.schema.createTable('platform', (table) => {
        table.string('guid').primary()
        table.string('name')
        table.index('name', 'platform_name_idx')
    });

    // creates table for game_platform
    knex.schema.createTable('game_platform', (table) => {
        table.foreign('game_id').references('game.guid')
        table.foreign('platform_id').references('platform.guid')
    });

};

exports.down = function(knex, Promise) {

};

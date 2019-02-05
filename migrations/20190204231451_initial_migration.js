
exports.up = function(knex, Promise) {
    return Promise.all([
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
        }),
        // creates table for platform
        knex.schema.createTable('platform', (table) => {
            table.string('guid').primary()
            table.string('name')
            table.index('name', 'platform_name_idx')
        }),
        // creates table for game_platform
        knex.schema.createTable('game_platform', (table) => {
            table.string('game_id').references('game.guid')
            table.string('platform_id').references('platform.guid')
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

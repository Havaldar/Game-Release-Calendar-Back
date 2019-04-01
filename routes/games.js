const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');

function getSegmentedList(list, capacity=10) {
	let segmentedList = [];
	for (let i = 0; i < list.length / capacity; i++) {
		let segment = []
		for (let j = 0; j < capacity && i * capacity + j < list.length; j++) {
			segment.push(list[i * capacity + j]);
		}
		segmentedList.push(segment);
	}
	return segmentedList
}

const getResourceById = (resourceName, targetField, processField) => (resourceIdList) => {
	if (resourceIdList.length <= 0) {
		return {};
	}
	resourceIdSegments = getSegmentedList(resourceIdList);
	let promises = resourceIdSegments.map(segment => {
		return new Promise((resolve, reject)=>{
			axios({
				url: `https://api-v3.igdb.com/${resourceName}`,
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'user-key': '459cdc689a17f4b90ce4b44270f4c94f',
				},
				data: `fields id,${targetField}; where id = (${segment.join(',')}); limit 50;`,
			}).then(response => {
				console.log(resourceName, targetField, resourceIdList);
				resolve(response.data);
			}).catch(err => {
				reject(err)
			});
		});
	});

	return new Promise((resolve, reject)=>{
		Promise.all(promises).then((response)=>{
			let resourceById = {};
			response.forEach(resourceList => {
				resourceList.forEach(resource => {
					resourceById[resource.id] = processField(resource[targetField]);
				});
			});
			resolve(resourceById);
		});
	});	
}	

const getPlatformsById = getResourceById('platforms', 'name', field => field);
const getCoverById = getResourceById('covers', 'url', field => field.slice(2));

router.post('/gamesForMonth', function(req, res, next){
	console.log(req.body.start, req.body.end);
	axios({
		url: "https://api-v3.igdb.com/games",
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'user-key': '459cdc689a17f4b90ce4b44270f4c94f',
		},
		data: `fields cover,name,platforms,popularity,first_release_date; where first_release_date != null & first_release_date > ${req.body.start} & first_release_date < ${req.body.end}; sort popularity desc; limit 50;`
	})
	.then(response => {
		const games = response.data;
		let platformIds = {};
		let coverIds = {};
		games.forEach(game => {
			if (game.platforms) {
				game.platforms.forEach(platformId => {
					platformIds[platformId] = true;
				});
			}
			if (game.cover) {
				coverIds[game.cover] = true;
			}
		});
		getPlatformsById(Object.keys(platformIds)).then(platformById => {
			getCoverById(Object.keys(coverIds)).then(coverById => {
				const result = games.map(game => ({
					name: game.name,
					cover: game.cover,
					platforms: game.platforms.map(platformId => platformById[platformId]),
					release_date: game.first_release_date,
					cover: coverById[game.cover]
				}));
				res.json(result);
			}).catch(err => {console.error(err)});
		}).catch(err => {console.error(err)});
  	}).catch(err => {console.error(err)});
});

module.exports = router;

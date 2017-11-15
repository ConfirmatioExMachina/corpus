"use strict";

const fs = require("fs");
const wiki = require("wikijs").default;
const pages = require("./pages");

const content = Promise.all(pages.map(async ({ en }) => {
	const corpusPage = await wiki().page(en);

	console.log(`Cleaning article ${en}`);

	return [en, await corpusPage.summary()];
})).then(result => result.reduce((map, [k, v]) => {
	map[k] = v;

	return map;
}, {}));

content.then(content => fs.writeFile("./data/corpus.json", JSON.stringify(content)));

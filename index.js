"use strict";

const fs = require("fs");
const wiki = require("wikijs").default;
const pages = require("./pages");

const content = Promise.all(pages.map(async ({ en }) => {
	const corpusPage = await wiki().page(en);

	console.log(`Cleaning article ${en}`);

	return [en, removeParenthesis(await corpusPage.summary())];
})).then(result => result.reduce((map, [k, v]) => {
	map[k] = v;

	return map;
}, {}));

content.then(content => fs.writeFile("./data/corpus.json", JSON.stringify(content)));

function removeParenthesis (content) {
	const stack = [];
	let result = "";

	for(let i = 0; i < content.length; i++) {
		switch (content[i]) {
		case "(":
			stack.unshift("(");
			break;
		case "[":
			stack.unshift("[");
			break;
		case ")":
			while(stack[0] !== "(" && stack.length > 0) {
				stack.shift();
			}
			stack.shift();
			break;
		case "]":
			while(stack[0] !== "]" && stack.length > 0) {
				stack.shift();
			}
			stack.shift();
			break;
		default:
			if(stack.length === 0) {
				result += content[i];
			}
		}
	}

	return result;
}

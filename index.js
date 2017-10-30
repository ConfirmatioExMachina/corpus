"use strict";

const wiki = require("wikijs").default;
const pages = require("./pages");

const content = Promise.all(pages.map(async ({ en }) => {
	const corpusPage = await wiki().page(en);

	return [en, pipeline(await corpusPage.summary())];
})).then(result => new Map(result));

content.then(console.log);

function pipeline (content) {
	return tokenize(removeParenthesis(content));
}

function tokenize(content) {
	return content.split(/\s+/).filter(token => token !== "");
}

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

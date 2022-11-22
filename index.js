"use strict";

const { createHandler } = require('graphql-http/lib/use/node');
const executeFn = require('./lib/execute');
const generateSchema = require('./lib/schema');

exports.setHttpHandler = function setHttpHandler({
	schema,
	context,
	onEnd
}) {
	return createHandler({
		schema,
		context,
		execute: args => executeFn(args, onEnd)
	})
}

exports.buildSchema = function buildSchema(schema, resolvers, directives) {
	return generateSchema(schema, resolvers, directives);
}
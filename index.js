"use strict";

const { createHandler } = require('graphql-http/lib/use/node');
const executeFn = require('./lib/execute');
const generateSchema = require('./lib/schema');

/**
 * Creates GraphQL request handler.
 * 
 * @param {object} schema
 * 	An object generated
 * @param {object} context
 * @param {function} onEnd
 * @return {Function}
 **/
exports.createHandler = function createHttpHandler({
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

/**
 * Generate schema to use in the http handler.
 * 
 * @param {array<String>} typeDefs
 * @param {object} resolvers
 * @param {array<{name: String, resolve: Function, before: Boolean}>} directives
 * @return {Object<GraphQLSchema>}
 **/
exports.buildSchema = function buildSchema(typeDefs, resolvers, directives) {
	return generateSchema(typeDefs, resolvers, directives);
}
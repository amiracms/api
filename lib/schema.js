"use strict";

//const {buildSchema, extendSchema} = require("graphql");
const {makeExecutableSchema} = require('@graphql-tools/schema');
const {parse} = require("graphql/language/parser");
const {
	mapSchema, 
	getDirective, 
	MapperKind
	} = require('@graphql-tools/utils');
const _ = require('underscore');
const {ObjectType, ArrayType, DateTime} = require('./type');

module.exports = function generateSchema(schemas, resolvers, directives) {
	let _schema = makeExecutableSchema({
		typeDefs: [
			`
			scalar Object
			scalar Array
			scalar DateTime

			type Query {
				connect: String
			}

			type Mutation {
				connect: String
			}

			type Subscription {
				connect: String
			}`,
			...schemas
		],
		resolvers: {Object: ObjectType, Array: ArrayType, DateTime}
	});
	
	return mapSchema(_schema, {
		[MapperKind.OBJECT_FIELD](fieldConfig, fieldName, parentName) {
			if (resolvers[fieldName]) {
				return {
					...fieldConfig,
					resolve: fieldResolver(
						resolvers[fieldName],
						fieldName,
						parentName,
						getDirectives(_schema, fieldConfig, directives)
					)
				}
			}

			if (resolvers[parentName] 
				&& resolvers[parentName][fieldName]) {
				return {
					...fieldConfig,
					resolve: fieldResolver(
						resolvers[parentName][fieldName],
						fieldName,
						parentName,
						getDirectives(_schema, fieldConfig, directives)
					)
				}
			}

			return fieldConfig;
		}
	})
}

function fieldResolver(resolver, fieldName, parentName, {before, after}) {
	return async (source, args, context, info) => {
		const schema = info.schema;

		// Let's not waste resources if the schema itself marks as invalid
		// The validatity usually handled by the `connect` handler to validate
		// the integrity of the request.
		if (!schema.isValid) {
			//return null;
		}

		// Validate before directives
		if (before && before.length > 0) {
			for(const {resolve, args} of before) {
				const isValid = await resolve.call(null, args, context);

				if (!isValid) {
					return null;
				}
			}
		}

		const res = await resolver.call(null, source, args, context, info);

		if (_.isError(res)) {
			if (!schema.error) {
				schema.error = {};
			}

			schema.error[fieldName] = res;

			return null;
		}

		if (!after || !after.length) {
			return res;
		}

		// Validate after directives
		return after
			.reduce(
				(p, {resolve, args}) => 
					p.then(r => resolve.call(null, r, args, context)),
				Promise.resolve(res)
			)
	}
}

function getDirectives(schema, obj, dirList) {
	const list = _.indexBy(dirList, 'name');

	return _.keys(list)
		.reduce(
			(d, {name, resolve, before}) => {
				const dir = getDirective(schema, obj, name);

				if (!dir) {
					return d;
				}

				if (before) {
					d.before.push({resolve, args: dir});

					return d;
				}

				d.after({resolve, args: dir});

				return d;
			},
			{before: [], after: []}
		)
}
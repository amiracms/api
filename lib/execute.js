"use strict";

const {
		assertValidExecutionArguments,
	    buildExecutionContext,
	    getFieldDef,
	    buildResolveInfo,
	    execute
	} = require("graphql/execution/execute");
const {getArgumentValues} = require("graphql/execution/values");
const {getOperationRootType} = require("graphql/utilities/getOperationRootType");
const _ = require('underscore');

module.exports = async function executeFn({
	document,
	contextValue,
	variableValues,
	schema,
	rootValue,
	operationName
}, onEnd) {
	assertValidExecutionArguments(schema, document, variableValues);

	const exeContext = buildExecutionContext(
        schema,
        document,
        rootValue,
        contextValue,
        variableValues,
        operationName
    );

    if (exeContext.errors && exeContext.errors.length > 0) {
    	return {errors: exeContext.errors};
    }

    const operation = getOperationRootType(
    	exeContext.schema, 
    	exeContext.operation
    );

    // Store field error
    schema.error = {};

    const data = await execute({
		schema,
		document,
        rootValue,
        contextValue,
        variableValues,
        operationName
	});

	// Store error
	data.error = schema.error;

	if (onEnd) {
		await onEnd.call(null, data);
	}

	return data;
}
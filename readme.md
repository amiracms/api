# @amira/api
*@amira/api* is a simple GraphQL nodejs server package which can handle any GraphQL client requests.

## Installation
```ssh
npm install @amira/api
```

## Methods

##### buildSchema(typeDef: *Array<String>*, resolvers: *Object*, directives: *Array<{name: String, resolve: Function, before: Boolean}*>): GraphQLSchema
This is a simple yet powerful method use to generate GraphQL schema. The simplicity focuses on how the parameters are handled. It eliminates the process of creating complex building blocks of code for the type definition, resolvers, and of course directives.

##### createHandler({schema: Object, context: Object, onEnd: Function}): Function
This is wrapper for **graphql-http** *createHandler* method with custom execution processor which accepts a callback function to further manipulate the return data properties.

## Usage
```javascript
const app = require('express');
const {buildSchema, createHandler} = require('@amira/api');

const schema = buildSchema(
	// type definition
	[
		`
		directive @user(permission: String) on FIELD_DEFINITION

		type User {
			Id: Int
			email: String
		}

		extend type Query {
			getUser(Id: Int!): User
		}
		`
	],
	// resolvers
	{
		Query: {
			getUser(source, args, context) {
				return {Id: 1, email: 'admin@local.local'};
			}
		}
	}
	// directives
	[
		{
			name: 'user',
			before: true,
			resolve: (args, context) {
				// do validation....
				return true;
			}
		}
	]
);

app.use(createHander({schema, context: {me: 'u'}}));
app.listen(3000);
```


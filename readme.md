# @amira/api
*@amira/api* is a simple GraphQL nodejs server package which can handle any GraphQL client requests.

## Installation
```ssh
npm install @amira/api
```

## Usage
```javascript
const app = require('express');
const {buildSchema, createHandler} = require('@amira/api');

const schema = buildSchema(
	[
		`
		type User {
			Id: Int
			email: String
		}

		extend type Query {
			getUser(Id: Int!): User
		}
		`
	],
	Query: {
		getUser(source, args, context) {
			return {Id: 1, email: 'admin@local.local'};
		}
	}
);

app.use(createHander({schema, context: {me: 'u'}}));
app.listen(3000);
```

## Methods

### buildSchema(typeDef: Array<String>, resolvers: Object, directives: Array<{name: String, resolve: Function, before: Boolean}>): GraphQLSchema
Is the method use to generate GraphQL schema base on the given parameters.

- *typeDef*


### createHttpHandler({schema: Object, context: Object, onEnd: Function}): Function


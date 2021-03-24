const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

export const logIn = async (event, context, callback) => {

    let body = JSON.parse(event.body);
    const { email, senha, userId } = body;
    const token = uuid.v4();

    const post = {
        userId: userId,
        email,
        senha,
        token
    };

    return db.put({
        TableName: 'sessao',
        Item: post
    }).promise().then(() => {
        callback(null, response(200, { userId, email, token }));
    }).catch(err => callback(null, response(err.statusCode, err)));
};

function response(statusCode, message) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(message)
    };
}
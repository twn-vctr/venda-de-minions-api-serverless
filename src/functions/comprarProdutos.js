const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

export const comprarProdutos = async (event, context, callback) => {

    let body = JSON.parse(event.body);
    const { produtos, precoTotal, email, cep, endereco } = body;

    const post = {
        userId: uuid.v4(),
        email,
        cep,
        endereco,
        precoTotal,
        produtos
    };

    return db.put({
        TableName: 'comprasUsuarios',
        Item: post
    }).promise().then(() => {
        callback(null, response(201, post));
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
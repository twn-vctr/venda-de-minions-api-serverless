const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../functions/smtp.js');

export const comprarProdutos = async (event, context, callback) => {

    let body = JSON.parse(event.body);
    const { produtos, precoTotal, email, cep, endereco } = body;

    const transporter = nodemailer.createTransport({
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        auth: {
            user: SMTP_CONFIG.user,
            pass: SMTP_CONFIG.pass
        },
        tls: {
            ciphers:'SSLv3'
        },
    });


    await transporter.sendMail({
        text: `Foi realizada uma compra no valor de ${precoTotal.toFixed(2).replace('.', ',')} para o endereço: ${endereco} \n Obrigado pela preferência :D`,
        subject: "Compra Realizada",
        from: "Venda de Minions",
        to: [`${email}`, "tawan.victor@engenharia.ufjf.br"]
    });


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
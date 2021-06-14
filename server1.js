const express = require('express')
const app = express()
const port = 3001
const axios = require('axios')

const PROTO_PATH = __dirname + '/protos/test.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;
const client = new hello_proto.Greeter('localhost:50051',
    grpc.credentials.createInsecure());

app.get('/grpc', (req, res) => {
    client.sayHello({ name: 'Minhh' }, function (err, response) {
        res.json(response)
    });
})

app.get('/http', async (req, res) => {
    const data = await axios.get('http://localhost:3002/message?name=Minhh')
    res.json(data.data)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

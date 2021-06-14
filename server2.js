const express = require('express')
const app = express()
const port = 3002

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

function sayHello(call, callback) {
    let data = [];
    for (let i = 0; i < 8000; i++) {
        data.push(call.request.name)
    }
    callback(null, { message: data });
}


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/message', (req, res) => {
    let data = [];
    for (let i = 0; i < 8000; i++) {
        data.push(req.query.name)
    }
    res.json({ message: data });
});

app.listen(port, () => {
    const server = new grpc.Server();
    server.addService(hello_proto.Greeter.service, { sayHello: sayHello });
    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('server grpc start at port 50051')
        server.start();
    });
    console.log(`Example app listening at http://localhost:${port}`)
})
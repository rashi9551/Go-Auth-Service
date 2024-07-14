import path from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader" 
import "dotenv/config"
import { Authcontroller } from "./controller/authController";
import express from 'express'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, './protos/auth.proto'))
const grpcObject = (grpc.loadPackageDefinition(packageDef) as unknown) as any
const authpackage = grpcObject.authpackage



const controller = new Authcontroller()

const server = new grpc.Server()

const grpcServer = () => {
    const port = process.env.AUTH_GRPC_PORT || '3001';
    const Domain=process.env.NODE_ENV==='dev'?process.env.DEV_DOMAIN:process.env.PRO_DOMAIN_AUTH
    console.log(Domain)
    console.log(`0.0.0.0:${port}=-=-=-==-==-==`)
    server.bindAsync(`0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (err, boundPort) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('grpc-auth server started on port', boundPort);
        }
    );
}

server.addService(authpackage.Auth.service, {
    IsAuthenticated : controller.isAuthenticated,   
    RefreshToken: controller.verifyToken
    }
)

grpcServer();
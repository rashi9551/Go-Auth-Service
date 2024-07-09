import path from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader" 
import "dotenv/config"
import { Authcontroller } from "./controller/authController";


const packageDef = protoLoader.loadSync(path.resolve(__dirname, './protos/auth.proto'))
const grpcObject = (grpc.loadPackageDefinition(packageDef) as unknown) as any
const authpackage = grpcObject.authpackage



const controller = new Authcontroller()

const server = new grpc.Server()

const grpcServer = () => {
    const port = process.env.AUTH_PORT || '3001';
    server.bindAsync(`localhost:${port}`,
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
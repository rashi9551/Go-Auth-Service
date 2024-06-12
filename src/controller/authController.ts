import jwt, { Secret } from 'jsonwebtoken'
import "dotenv/config"
export class Authcontroller {


    isAuthenticated = async (call:any, callback:any) => {
        try{
            console.log("its coming heare");
            const token = call.request.token || '';            
            const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN || "Rashid" as Secret)
            if(!decoded){
                throw new Error('Invalid token')
            }
            callback(null,{userId : decoded.id, role: decoded.role})
        }catch(e: any){
            callback(e, null)
         }
    }

    verifyToken = async(call:any, callback:any) => {
        try{
            const refreshtoken = call.request.token as string;
            const decoded: any = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN as Secret);
            if(!decoded){
                throw new Error("invalid token")
            }
            const refreshToken = jwt.sign({id: decoded.id, role: decoded.role}, process.env.REFRESH_TOKEN as Secret, {
                expiresIn: "5m"
            })
            const accessToken = jwt.sign({id: decoded.id, role: decoded.role}, process.env.ACCESS_TOKEN as Secret, {
                expiresIn: "3d"
            })
            const response = {accessToken, refreshToken}
            callback(null, response)
        }catch(e:any){
            callback(e, null)
        }
    }
}
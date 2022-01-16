import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import {IUser} from '../../interface/interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super();
    }

    async validate(username:string, password: string):Promise<IUser | any>{
        const user = await this.authService.validateUser(username, password);
        if(!user){
            throw new UnauthorizedException("This point was reached");
        }
        return user;
    }
}
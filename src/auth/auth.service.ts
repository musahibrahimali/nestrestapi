import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {IUser} from '../interface/interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    // register user
    async register(user: IUser): Promise<IUser | any> {
        const _user = await this.userService.createUser(user);
        const payload = { username: user.username, sub: _user._id };
        return this.jwtService.sign(payload)
    }

    // log user in
    async login(user:any): Promise<IUser | any> {
        const payload = { username: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    // get the profile of a user
    async getProfile(id: string): Promise<IUser | any> {
        return this.userService.getProfile(id);
    }

    async validateUser(email: string, password: string): Promise<IUser | any> {
        const user = await this.userService.findOne(email, password);
        if(!user) {
            return null;
        }
        return user;
    }
}

import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserModel } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel:Model<UserModel>) { }

    // create a new user
    async createUser(createUserDto: CreateUserDto): Promise<User | any> {
        try{
            // check if email doesnt already exist
            const user = await this.userModel.findOne({email: createUserDto.username});
            if(user) {
                throw new NotFoundException('User already exists!');
            }
            // set the email to username
            // hash the password
            createUserDto.salt = await bcrypt.genSalt(10);
            const hashedPassword = await this.hashPassword(createUserDto.password, createUserDto.salt);
            // add the new password and salt to the dto
            createUserDto.password = hashedPassword;
            // create a new user
            const createdUser = new this.userModel(createUserDto);
            return await createdUser.save();
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // find one user
    async findOne(email: string, password:string): Promise<User | any> {
        try{
            const user = await this.userModel.findOne({email: email});
            if(!user) {
                throw new NotFoundException('User does not exist!');
            }
            // compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {
                return null;
            }
            const userData = {
                id: user._id,
                email: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            }
            return userData;
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // get the profile of a user
    async getProfile(id: string): Promise<User | any> {
        try{
            const user = await this.userModel.findById(id);
            if(!user) {
                throw new NotFoundException('User does not exist!');
            }
            const userData = {
                id: user._id,
                email: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            }
            return userData;
        }catch(err){
            // return the error message and code
            return {
                message: err.message,
            };
        }
    }

    // hash the password
    private async hashPassword(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
}

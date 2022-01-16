import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsString } from "class-validator";
import { Document } from "mongoose";

export type UserModel = User & Document;

@Schema({ timestamps: true })
export class User {
    @IsString()
    @Prop({ required: false, default: '' })
    socialId: string;

    @IsString()
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: false })
    password: string;

    @IsString()
    @Prop({required: false})
    displayName: string;

    @IsString()
    @Prop({ required: false })
    firstName: string;

    @IsString()
    @Prop({required: false})
    lastName: string;

    @IsString()
    @Prop({required: false})
    salt: string;

    @IsString()
    @Prop({required: false})
    phone: string;

    @IsString()
    @Prop({required: false})
    address: string;

    @IsString()
    @Prop({required: false})
    city: string;

    @Prop({required: false, default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'})
    profilePicture: string;

    @IsString()
    @Prop({required: true})
    roles: [string];

    @IsBoolean()
    @Prop({required: true})
    isAdmin: boolean;
}


export const UserSchema = SchemaFactory.createForClass(User);
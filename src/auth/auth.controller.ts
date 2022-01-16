import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/guards';
import { JwtAuthGuard } from '../authorization/authorizations';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserResponseDto } from './dto/userresponse.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
    ) {}
    
    @ApiCreatedResponse({type: String})
    @Post('register')
    async register(@Body() creatUserDto:CreateUserDto) {
        const {
            username, password, firstName, lastName, roles, isAdmin,
            displayName, phone, address, city, profilePicture
        } = creatUserDto;
        const user = {
            username, password, firstName, lastName, isAdmin,
            roles, displayName, phone, address, city, profilePicture,
        }
        const token = await this.authService.register(user);
        return {token : token};
    }

    @ApiCreatedResponse({type: String})
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() request, @Response({passthrough: true}) response) {
            const token = await this.authService.login(request.user);
            response.cookie('access_token', token, {
                domain: 'localhost',
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
            })
            return {access_token : token};
    }

    @ApiCreatedResponse({type: UserResponseDto})
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() request) {
        const {userId} = request.user;
        return this.authService.getProfile(userId);
    }
}

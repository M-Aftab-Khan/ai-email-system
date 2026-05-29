import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/user.dto';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authservice:AuthService
    ){}

    @Post('register')
    register(@Body() data:CreateUserDto){
        return this.authservice.registerUser(data);
    }

    @Post('login')
    login(@Body() data:LoginDto){
        return this.authservice.loginUser(data);
    }
}

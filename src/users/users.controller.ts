import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@Controller('users')
export class UsersController {

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req:any) {    
        
       return{
        user: req.user
       }
    }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/user.dto'
import { LoginDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {JwtService} from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private prisma:PrismaService,
        private jwtService:JwtService
    ){}
    async registerUser(data:CreateUserDto){

        const existingUser = await this.prisma.user.findUnique({
            where:{
                email:data.email
            }
        })

        if(existingUser){
            throw new BadRequestException('User with this email already exists');
        }
        const {password,...rest} = data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await  this.prisma.user.create({
            data:{
                ...rest,
                password:hashedPassword
            }
        })

        return {
            messsage:'User registered successfully',
            user:{
                name:user.name,
                email:user.email
            }
        }
    }

    async loginUser(data:LoginDto){
        const {email,password} = data;
        const user = await this.prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            throw new BadRequestException('Invalid email or password');
        }

        const isValidPassword = await bcrypt.compare(password,user.password);

        if(!isValidPassword){
            throw new BadRequestException('Invalid email or password');
        }

        // create token 

        const token = this.jwtService.sign({userId:user.id,email:user.email});

        return {
            message:'Login successful',
            token
        }

    }
}

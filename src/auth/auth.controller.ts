import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  LoginUserDto } from './dto/login-user.dto';
import { UpdateAuthDto } from './dto/login-user-update.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }

}

import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { async } from 'rxjs';

@ApiTags('鉴权')
@Controller('auth')
export class AuthController {
  // constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  // @Post('login')
  // async login(@Body() user: LoginDto, @Req() req) {
  //   return '11111';
  //   return req.user;
  // }
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() user: LoginDto, @Req() req) {
    return req.user;
  }
}

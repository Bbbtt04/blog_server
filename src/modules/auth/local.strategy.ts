import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { enPassword } from '../../utils';
import { ConfigService } from '@nestjs/config';
import { BusinessException } from '../../exceptions/business.exception.filter';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await this.authService.validateUser(username);
    if (!user) {
      throw new BusinessException('用户名不存在!');
    }

    const secretKey = this.configService.get('USER_SECRET_KEY');
    // console.log(enPassword(123456, secretKey));
    if (user.password !== enPassword(password, secretKey)) {
      throw new BusinessException('用户名或密码错误');
    }
    return await this.authService.signToken(user);
  }
}

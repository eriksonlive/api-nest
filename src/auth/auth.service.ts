import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersServices: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersServices.findOneByEmail(registerDto.email);

    if (user)
      throw new BadRequestException('Este email ya se encuentra registrado');

    await this.usersServices.create({
      ...registerDto,
      password: await bcryptjs.hash(registerDto.password, 10),
    });

    return {
      name: registerDto.name,
      email: registerDto.email,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersServices.findOneByEmail(loginDto.email);

    if (!user) throw new UnauthorizedException('Correo Invalido');

    const res = await bcryptjs.compare(loginDto.password, user.password);

    if (!res) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    const { password, ...data } = user;

    return {
      ...data,
      token,
    };
  }

  async profile({ email, role }: { email: string; role: string }) {

    const { password, ...res } = await this.usersServices.findOneByEmail(email);

    return res;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  async login(loginDto: LoginDto): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('Credenciales inválidas: correo o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Credenciales inválidas: correo o contraseña incorrectos');
    }

    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword as Omit<User, 'password'>,
    };
  }
}

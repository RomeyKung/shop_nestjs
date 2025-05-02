import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
        },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException(
          'Email or Display Name already exists.',
        );
      }
    }
  }

  async getAllUsers() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }

  async getUser(id: number) {
    try {
      return await this.prismaService.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Not found user.');
      }
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException(
          'Email or Display Name already exists.',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Not found user.');
      }
    }
  }

  async removeUser(id: number) {
    try {
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      // console.error('[DELETE ERROR]', {
      //   name: error.name,
      //   code: error.code,
      //   message: error.message,
      //   meta: error.meta,
      // });
      if (error.code === 'P2025') {
        throw new NotFoundException('Not found user.');
      }
    }
  }

  async getUserByFilter(filter: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });
  }
}

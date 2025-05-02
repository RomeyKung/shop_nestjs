import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/get-user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('2. User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'This endpoint creates a new user in the system with the provided data.',
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get your user information',
    description:
      'This endpoint returns the profile information of the currently authenticated user.',
  })
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  getMe(@CurrentUser() user: TokenPayload) {
    return user;
  }

  //  <--- GET ALL --->

  // @Get()
  // @ApiOperation({
  //   summary: 'Get a list of all users',
  //   description:
  //     'This endpoint returns a list of all registered users in the system.',
  // })
  // @ApiCookieAuth()
  // @UseGuards(JwtGuard)
  // getAllUsers() {
  //   return this.userService.getAllUsers();
  // }

  //  <--- GET 1 --->

  // @Get(':id')
  // @ApiParam({
  //   name: 'id',
  //   required: true,
  //   description: 'ID of the user to get',
  //   type: Number,
  // })
  // @ApiOperation({
  //   summary: 'Get user information by ID',
  //   description:
  //     'This endpoint returns the information of the user with the specified ID.',
  // })
  // @ApiCookieAuth()
  // @UseGuards(JwtGuard)
  // getUser(@Param('id') id: number) {
  //   return this.userService.getUser(+id);
  // }

  //  <--- UPDATE --->

  // @Patch(':id')
  // @ApiParam({
  //   name: 'id',
  //   required: true,
  //   description: 'ID of the user to update',
  //   type: Number,
  // })
  // @ApiOperation({
  //   summary: 'Update user display name',
  //   description: 'This endpoint allows updating the display name of the user.',
  // })
  // @ApiCookieAuth()
  // @UseGuards(JwtGuard)
  // updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.updateUser(+id, updateUserDto);
  // }

  //  <--- DELETE --->

  // @Delete(':id')
  // @ApiParam({
  //   name: 'id',
  //   required: true,
  //   description: 'ID of the user to delete',
  //   type: Number,
  // })
  // @ApiOperation({
  //   summary: 'Delete user account',
  //   description: 'This endpoint deletes the user account from the system.',
  // })
  // @ApiCookieAuth()
  // @UseGuards(JwtGuard)
  // removeUser(@Param('id') id: number) {
  //   return this.userService.removeUser(+id);
  // }
}

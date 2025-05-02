import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ example: 'example@example.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password1234!' })
  @IsNotEmpty()
  password: string;
}

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

const MIN_PASSWORD = 3;

export class CreateUserRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(MIN_PASSWORD)
  password: string;
}

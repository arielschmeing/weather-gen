import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/create-user.request';
import { Public } from 'src/decorators/public.decorator';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthRequest } from '../auth/dto/auth.request';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() request: CreateUserRequest) {
    return this.userService.create(request);
  }

  @Get()
  list() {
    return this.userService.list();
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  remove(@Req() req: AuthRequest) {
    return this.userService.remove(req.user.email);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('name')
  changeName(@Body() request: { name: string }, @Req() req: AuthRequest) {
    return this.userService.changeName(request.name, req.user.email);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('password')
  changePassword(
    @Body() request: { password: string },
    @Req() req: AuthRequest,
  ) {
    return this.userService.changePassword(request.password, req.user.email);
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserRequest } from './dto/create-user.request';
import {
  ForbiddenUserException,
  DatabaseException,
  ResourceNotFoundException,
} from 'src/exceptions';
import { UserResponse } from './dto/user.response';
import * as bcrypt from 'bcryptjs';
import { UserMapper } from './mapper/user.mapper';

const SALT = 10;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userMapper: UserMapper,
  ) {}

  async create({ email, name, password }: CreateUserRequest): Promise<void> {
    try {
      const existingUser = await this.userModel.findOne({ email }).exec();

      if (existingUser) {
        throw new ConflictException('Email already registered', {
          cause: new Error(),
          description: 'This email is already in use by another user.',
        });
      }

      const hashPassword = await bcrypt.hash(password, SALT);

      const newUser = new this.userModel({
        email,
        name,
        password: hashPassword,
      });

      await newUser.save();
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error('Error creating user', error);
      throw new DatabaseException('Error creating user');
    }
  }

  async list(): Promise<UserResponse[]> {
    try {
      const users = await this.userModel.find().exec();
      return users.map((u) => this.userMapper.toResponse(u));
    } catch (error) {
      this.logger.error('Error listing users', error);
      throw new DatabaseException('Error fetching users');
    }
  }

  async findByEmail(email: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      return this.validationUser(user);
    } catch (error) {
      if (error instanceof ForbiddenUserException) throw error;
      this.logger.error(`Error fetching user by email: ${email}`, error);
      throw new DatabaseException('Error fetching user');
    }
  }

  async findById(id: string): Promise<UserResponse> {
    try {
      const user = await this.userModel.findById(id).exec();
      return this.userMapper.toResponse(this.validationUser(user));
    } catch (error) {
      if (error instanceof ForbiddenUserException) throw error;
      if (error.name === 'CastError') {
        throw new ResourceNotFoundException('User', id);
      }
      this.logger.error(`Error fetching user by ID: ${id}`, error);
      throw new DatabaseException('Error fetching user');
    }
  }

  async remove(email: string): Promise<void> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      this.validationUser(user);

      await this.userModel.deleteOne({ email });
    } catch (error) {
      if (error instanceof ForbiddenUserException) throw error;
      this.logger.error(`Error removing user: ${email}`, error);
      throw new DatabaseException('Error removing user');
    }
  }

  async changeName(newName: string, email: string): Promise<void> {
    try {
      const user = await this.findByEmail(email);

      if (user.name === newName) {
        throw new BadRequestException('Name same as current', {
          cause: new Error(),
          description: 'The new name is the same as the current user name.',
        });
      }

      user.name = newName;
      user.updatedAt = new Date();

      await user.save();
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenUserException ||
        error instanceof DatabaseException
      ) {
        throw error;
      }
      this.logger.error(`Error changing user name: ${email}`, error);
      throw new DatabaseException('Error changing user name');
    }
  }

  async changePassword(newPassword: string, email: string): Promise<void> {
    try {
      const user = await this.findByEmail(email);

      if (await bcrypt.compare(newPassword, user.password)) {
        throw new BadRequestException('Password same as current', {
          cause: new Error(),
          description: 'The new password is the same as the current user password.',
        });
      }

      user.password = await bcrypt.hash(newPassword, SALT);
      user.updatedAt = new Date();

      await user.save();
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenUserException ||
        error instanceof DatabaseException
      ) {
        throw error;
      }
      this.logger.error(`Error changing user password: ${email}`, error);
      throw new DatabaseException('Error changing user password');
    }
  }

  private validationUser(user: UserDocument | null): UserDocument {
    if (!user) throw new ForbiddenUserException();
    return user;
  }
}

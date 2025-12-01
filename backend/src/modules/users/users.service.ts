import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserRequest } from './dto/create-user.request';
import { ForbiddenUserException } from 'src/exceptions/forbidden-user.exception';
import { UserResponse } from './dto/user.response';
import bcrypt from 'node_modules/bcryptjs';

const SALT = 10;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create({ email, name, password }: CreateUserRequest): Promise<void> {
    const hashPassword = await bcrypt.hash(password, SALT);

    const newUser = new this.userModel({
      email,
      name,
      password: hashPassword,
    });

    await newUser.save();
    return;
  }

  async list(): Promise<UserResponse[]> {
    const users = await this.userModel.find().exec();
    return users.map((u) => this.toUserResponse(u));
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    return this.validationUser(user);
  }

  async findById(id: string): Promise<UserResponse> {
    const user = await this.userModel.findById(id).exec();
    return this.toUserResponse(this.validationUser(user));
  }

  async remove(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email }).exec();
    this.validationUser(user);

    await this.userModel.deleteOne({ email });
  }

  async changeName(newName: string, email: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (user.name === newName)
      throw new BadRequestException('Same name', {
        cause: new Error(),
        description: 'New name same as current user name.',
      });

    user.name = newName;
    user.updatedAt = new Date();

    await user.save();
    return;
  }

  async changePassword(newPassword: string, email: string) {
    const user = await this.findByEmail(email);

    if (await bcrypt.compare(newPassword, user.password))
      throw new BadRequestException('Same password', {
        cause: new Error(),
        description: 'New password same as current user password.',
      });

    user.password = await bcrypt.hash(newPassword, SALT);
    user.updatedAt = new Date();

    await user.save();
    return;
  }

  private validationUser(user: UserDocument | null): UserDocument {
    if (!user) throw new ForbiddenUserException();
    return user;
  }

  private toUserResponse(user: UserDocument): UserResponse {
    return {
      id: user._id.toString(),
      createdAt: user.createdAt,
      email: user.email,
      name: user.name,
      updatedAt: user.updatedAt,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { UserDocument } from '../schemas/users.schema';
import { UserResponse } from '../dto/user.response';

@Injectable()
export class UserMapper {
  toResponse(model: UserDocument): UserResponse {
    return {
      id: model._id.toString(),
      createdAt: model.createdAt,
      email: model.email,
      name: model.name,
      updatedAt: model.updatedAt,
    };
  }
}

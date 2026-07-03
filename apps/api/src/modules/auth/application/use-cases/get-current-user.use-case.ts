import { Injectable } from "@nestjs/common";

@Injectable()
export class GetCurrentUserUseCase {
  async execute(user: any) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }
}

// Handles user logout and invalidates refresh token.

import { Inject, Injectable } from "@nestjs/common";

import { INJECTION_TOKENS } from "../../../../core/constants/injection-tokens";

import type { UserRepository } from "../../../users/domain/repositories/user.repository";

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.updateRefreshToken(null);

    await this.userRepository.update(user);

    return {
      success: true,
    };
  }
}

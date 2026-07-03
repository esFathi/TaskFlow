// Use-case: authenticate a user and issue access/refresh tokens.

import { INJECTION_TOKENS } from "@/core/constants/injection-tokens";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { UserRepository } from "@/modules/users/domain/repositories/user.repository";
import { PasswordHasherPort } from "../ports/password-hasher.port";
import { TokenServicePort } from "../ports/token-service.port";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(INJECTION_TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(INJECTION_TOKENS.TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("invalid credentials");
    }

    const isValidPassword = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException("invalid credentials");
    }

    return this.tokenService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}

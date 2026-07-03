// Use-case: register a new user (hash password, persist, return tokens).

import { Inject, Injectable } from "@nestjs/common";
import { RegisterDto } from "../dtos/register.dto";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
import { PasswordHasherPort } from "../ports/password-hasher.port";
import { TokenServicePort } from "../ports/token-service.port";
import { User } from "../../../users/domain/entities/user.entity";
import { ConflictException } from "@nestjs/common";
import { INJECTION_TOKENS } from "@/core/constants/injection-tokens";

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(INJECTION_TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(INJECTION_TOKENS.TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(dto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = User.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
    });

    const tokens = await this.tokenService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const hashedRefreshToken = await this.passwordHasher.hash(
      tokens.refreshToken,
    );

    user.updateRefreshToken(hashedRefreshToken);

    await this.userRepository.save(user);

    return {
      accessToken: tokens.accessToken,

      refreshToken: tokens.refreshToken,
    };
  }
}

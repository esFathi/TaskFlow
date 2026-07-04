import { INJECTION_TOKENS } from "@/core/constants/injection-tokens";
import { UserRepository } from "@/modules/users/domain/repositories/user.repository";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PasswordHasherPort } from "../ports/password-hasher.port";
import { TokenServicePort } from "../ports/token-service.port";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(INJECTION_TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(INJECTION_TOKENS.TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(dto: RefreshTokenDto) {
    let payload;

    try {
      payload = await this.tokenService.verifyRefreshToken(dto.refreshToken);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const matches = await this.passwordHasher.compare(
      dto.refreshToken,
      user.hashedRefreshToken,
    );

    if (!matches) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokens = await this.tokenService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const hashedRefreshToken = await this.passwordHasher.hash(
      tokens.refreshToken,
    );

    user.updateRefreshToken(hashedRefreshToken);

    await this.userRepository.update(user);

    return tokens;
  }
}

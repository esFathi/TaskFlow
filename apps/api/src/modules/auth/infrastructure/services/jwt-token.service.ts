// Infrastructure implementation of the token-service port (sign/verify JWTs).

import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import {
  TokenPayload,
  AuthTokens,
  TokenServicePort,
} from "../../application/ports/token-service.port";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("accessToken.secret"),

      expiresIn: this.configService.getOrThrow(
        "accessToken.expiresIn",
      ) as JwtSignOptions["expiresIn"],
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("refreshToken.secret"),

      expiresIn: this.configService.getOrThrow(
        "refreshToken.expiresIn",
      ) as JwtSignOptions["expiresIn"],
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwt.verifyAsync(token, {
      secret: this.configService.getOrThrow<string>("refreshToken.secret"),
    });
  }
}

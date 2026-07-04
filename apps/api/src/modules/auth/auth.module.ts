// Auth feature module.
// Wires auth controller, use-cases, strategies (JWT/local) and guards.

import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./presentation/controllers/auth.controller";

import { RegisterUseCase } from "./application/use-cases/register.use-case";

import { BcryptPasswordHasherService } from "./infrastructure/services/bcrypt-password-hasher.service";

import { JwtTokenService } from "./infrastructure/services/jwt-token.service";

import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";

import { UsersModule } from "../users/users.module";

import { INJECTION_TOKENS } from "../../core/constants/injection-tokens";
import { ConfigService } from "@nestjs/config";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { GetCurrentUserUseCase } from "./application/use-cases/get-current-user.use-case";
import { LogoutUseCase } from "./application/use-cases/logout";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_ACCESS_SECRET"),

        signOptions: {
          expiresIn: "15m",
        },
      }),
    }),
    UsersModule,
  ],

  controllers: [AuthController],

  providers: [
    RegisterUseCase,
    LoginUseCase,
    GetCurrentUserUseCase,
    LogoutUseCase,
    JwtStrategy,

    {
      provide: INJECTION_TOKENS.PASSWORD_HASHER,

      useClass: BcryptPasswordHasherService,
    },

    {
      provide: INJECTION_TOKENS.TOKEN_SERVICE,

      useClass: JwtTokenService,
    },
  ],
})
export class AuthModule {}

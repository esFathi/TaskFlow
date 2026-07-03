// HTTP controller for auth: register, login, refresh, and logout endpoints.

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";

import { RegisterDto } from "../../application/dtos/register.dto";

import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { LoginDto } from "../../application/dtos/login.dto";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { GetCurrentUserUseCase } from "../../application/use-cases/get-current-user.use-case";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CurrentUser } from "@/core/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body()
    dto: RegisterDto,
  ) {
    return this.registerUseCase.execute(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any) {
    return this.getCurrentUserUseCase.execute(user);
  }
}

// DTO for refresh token requests.

import { IsString, IsNotEmpty } from "class-validator";

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

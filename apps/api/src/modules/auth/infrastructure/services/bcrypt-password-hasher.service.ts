// Infrastructure implementation of the password-hasher port using bcrypt.

import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PasswordHasherPort } from "../../application/ports/password-hasher.port";

@Injectable()
export class BcryptPasswordHasherService implements PasswordHasherPort {
  async hash(value: string) {
    return bcrypt.hash(value, 12);
  }

  async compare(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}

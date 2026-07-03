// Domain entity for User.
// Pure business object holding state + invariants and behavior.
// No framework, ORM, or HTTP concerns here.

import { v7 as uuid } from "uuid";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

interface CreateUserProps {
  email: string;
  fullName: string;
  passwordHash: string;
}

export class User {
  private _id: string;
  private _email: string;
  private _fullName: string;
  private _passwordHash: string;
  private _role: UserRole;
  private _hashedRefreshToken?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    email: string;
    fullName: string;
    passwordHash: string;
    role: UserRole;
    hashedRefreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._email = props.email;
    this._fullName = props.fullName;
    this._passwordHash = props.passwordHash;
    this._role = props.role;
    this._hashedRefreshToken = props.hashedRefreshToken;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateUserProps): User {
    return new User({
      id: uuid(),
      email: props.email.toLowerCase(),
      fullName: props.fullName.trim(),
      passwordHash: props.passwordHash,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: {
    id: string;
    email: string;
    fullName: string;
    passwordHash: string;
    role: UserRole;
    hashedRefreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(props);
  }

  updateRefreshToken(hash: string | null) {
    this._hashedRefreshToken = hash ?? undefined;
    this._updatedAt = new Date();
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get fullName() {
    return this._fullName;
  }

  get passwordHash() {
    return this._passwordHash;
  }

  get role() {
    return this._role;
  }

  get hashedRefreshToken() {
    return this._hashedRefreshToken;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}

import { Args, Field, InputType, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@InputType()
export class LoginInput {
  @Field()
  address: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  @Mutation(() => String)
  async login(@Args("input") loginInput: LoginInput) {
    const token = await this.authService.login(loginInput.address);
    return token;
  }
}

import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./auth.schema";
import { JwtService } from "@nestjs/jwt";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CACHE_KEYS } from "src/constants";
import { Cache } from "cache-manager";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async login(address: string): Promise<string> {
    const user = await this.userModel.findOne({ address });
    if (!user) throw new BadRequestException("User not found");

    const cachedToken = await this.cacheManager.get(
      CACHE_KEYS.LOGIN_TOKEN_CACHE(address)
    );
    if (cachedToken) return cachedToken as string;

    const payload = { address: user.address, sub: user._id };
    const token = this.jwtService.sign(payload);
    console.log("token", token);
    await this.cacheManager.set(CACHE_KEYS.LOGIN_TOKEN_CACHE(address), token, {
      ttl: 3600,
    });
    return token;
  }
}

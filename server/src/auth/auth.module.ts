import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./auth.schema";
import { JwtModule } from "@nestjs/jwt";
import { ENV } from "src/constants";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: ENV.JWT_SECRET }),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}

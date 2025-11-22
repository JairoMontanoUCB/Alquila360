import { Module } from "@nestjs/common";
import { userInfo } from "os";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { EmailModule } from "src/email/email.module";

@Module({
    imports: [EmailModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}

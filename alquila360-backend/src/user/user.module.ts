import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserRating } from 'src/entity/user_rating.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [] ,
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

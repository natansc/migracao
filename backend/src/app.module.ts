import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module'; // <-- 1. Importe o UsersModule
// import { ApiModule } from './api/api.module'; // (Se existir, mantenha)

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule, // <-- 2. Adicione aqui na lista de imports
    // ... outros módulos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
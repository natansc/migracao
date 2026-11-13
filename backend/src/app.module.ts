import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
// ... outros imports

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <-- Isso carrega o arquivo .env
    DatabaseModule,
    // ... outros módulos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
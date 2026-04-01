import { Module } from '@nestjs/common';
import { AppController } from './src/app.controller';
import { AppService } from './src/app.service';
import { AnalyticsModule } from './src/analytics';
import { AuthModule } from './src/modules/auth/auth.module';

@Module({
  imports: [AnalyticsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
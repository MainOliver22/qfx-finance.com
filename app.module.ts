import { Module } from '@nestjs/common';
import { AppController } from './src/app.controller';
import { AppService } from './src/app.service';
import { AnalyticsModule } from './src/analytics';

@Module({
  imports: [AnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
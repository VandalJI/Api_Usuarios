import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MessageService } from './common/message.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        //console.log(">>> FINAL DATABASE_URL:", config.get('DATABASE_URL'));

        return {
          type: 'postgres',
          url: config.get<string>('DATABASE_URL'),
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),

    UsersModule,
  ],
  providers: [MessageService],
})
export class AppModule {}

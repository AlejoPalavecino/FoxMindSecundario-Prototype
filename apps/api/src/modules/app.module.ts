import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ClassroomsModule } from "./classrooms/classrooms.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["apps/api/.env", ".env"]
    }),
    PrismaModule,
    AuthModule,
    ClassroomsModule
  ],
  controllers: [AppController]
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { ClassroomsController } from "./classrooms.controller";
import { ClassroomsLogger } from "./classrooms.logger";
import { ClassroomsService } from "./classrooms.service";

@Module({
  controllers: [ClassroomsController],
  providers: [ClassroomsService, ClassroomsLogger]
})
export class ClassroomsModule {}

import { Module } from "@nestjs/common";
import { ClassroomsController } from "./classrooms.controller";
import { ClassroomsLogger } from "./classrooms.logger";
import { ClassroomsService } from "./classrooms.service";
import { StudentClassroomsController } from "./student-classrooms.controller";

@Module({
  controllers: [ClassroomsController, StudentClassroomsController],
  providers: [ClassroomsService, ClassroomsLogger]
})
export class ClassroomsModule {}

import { Module } from "@nestjs/common";
import { ClassroomsController } from "./classrooms.controller";
import { ClassroomsLogger } from "./classrooms.logger";
import { ClassroomsService } from "./classrooms.service";
import { StudentClassroomsController } from "./student-classrooms.controller";
import { SubmissionsController } from "./submissions.controller";

@Module({
  controllers: [ClassroomsController, StudentClassroomsController, SubmissionsController],
  providers: [ClassroomsService, ClassroomsLogger]
})
export class ClassroomsModule {}

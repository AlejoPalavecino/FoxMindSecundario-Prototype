import { Controller, Get, Req } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsService } from "./classrooms.service";

@Controller("student/classrooms")
@Roles("ALUMNO")
export class StudentClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Get()
  getStudentClassrooms(@Req() request: { user: JwtPayload }) {
    return this.classroomsService.getStudentClassrooms(request.user);
  }
}

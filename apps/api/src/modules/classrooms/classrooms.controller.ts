import { Body, Controller, Param, Patch, Post, Req } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsService } from "./classrooms.service";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { ImportEnrollmentsCsvDto } from "./dto/import-enrollments-csv.dto";

@Controller("classrooms")
@Roles("DOCENTE")
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  createClassroom(@Body() dto: CreateClassroomDto, @Req() request: { user: JwtPayload }) {
    return this.classroomsService.createClassroom(dto, request.user);
  }

  @Patch(":id")
  updateClassroom(
    @Param("id") id: string,
    @Body() dto: UpdateClassroomDto,
    @Req() request: { user: JwtPayload }
  ) {
    return this.classroomsService.updateClassroom(id, dto, request.user);
  }

  @Post(":id/enrollments")
  createEnrollment(
    @Param("id") id: string,
    @Body() dto: CreateEnrollmentDto,
    @Req() request: { user: JwtPayload }
  ) {
    return this.classroomsService.createEnrollment(id, dto, request.user);
  }

  @Post(":id/enrollments/csv")
  importEnrollmentsCsv(
    @Param("id") id: string,
    @Body() dto: ImportEnrollmentsCsvDto,
    @Req() request: { user: JwtPayload }
  ) {
    return this.classroomsService.importEnrollmentsFromCsv(id, dto, request.user);
  }
}

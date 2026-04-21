import { Body, Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsService } from "./classrooms.service";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { ImportEnrollmentsCsvDto } from "./dto/import-enrollments-csv.dto";
import { CreateClassroomActivityDto } from "./dto/create-classroom-activity.dto";

@Controller("classrooms")
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Get()
  @Roles("DOCENTE")
  getTeacherClassrooms(@Req() request: { user: JwtPayload }) {
    return this.classroomsService.getTeacherClassrooms(request.user);
  }

  @Post()
  @Roles("DOCENTE")
  createClassroom(@Body() dto: CreateClassroomDto, @Req() request: { user: JwtPayload }) {
    return this.classroomsService.createClassroom(dto, request.user);
  }

  @Patch(":id")
  @Roles("DOCENTE")
  updateClassroom(
    @Param("id") id: string,
    @Body() dto: UpdateClassroomDto,
    @Req() request: { user: JwtPayload }
  ) {
    return this.classroomsService.updateClassroom(id, dto, request.user);
  }

  @Post(":id/enrollments")
  @Roles("DOCENTE")
  createEnrollment(
    @Param("id") id: string,
    @Body() dto: CreateEnrollmentDto,
    @Req() request: { user: JwtPayload }
  ) {
    return this.classroomsService.createEnrollment(id, dto, request.user);
  }

  @Post(":id/enrollments/csv")
  @Roles("DOCENTE")
  importEnrollmentsCsv(
    @Param("id") id: string,
    @Body() dto: ImportEnrollmentsCsvDto,
    @Req() request: { user: JwtPayload }
  ) {
    return this.classroomsService.importEnrollmentsFromCsv(id, dto, request.user);
  }

  @Post(":id/activities")
  @Roles("DOCENTE")
  createClassroomActivity(
    @Param("id") id: string,
    @Body() dto: CreateClassroomActivityDto,
    @Req() request: { user: JwtPayload }
  ) {
    return this.classroomsService.createClassroomActivity(id, dto, request.user);
  }

  @Get(":id/activities")
  @Roles("DOCENTE", "ALUMNO")
  getClassroomActivities(@Param("id") id: string, @Req() request: { user: JwtPayload }) {
    return this.classroomsService.getClassroomActivities(id, request.user);
  }
}

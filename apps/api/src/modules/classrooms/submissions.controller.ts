import { Body, Controller, Param, Patch, Post, Req } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsService } from "./classrooms.service";
import { CreateSubmissionDto } from "./dto/create-submission.dto";
import { GradeSubmissionDto } from "./dto/grade-submission.dto";

@Controller()
export class SubmissionsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post("activities/:id/submissions")
  @Roles("ALUMNO")
  submitActivity(
    @Param("id") id: string,
    @Body() dto: CreateSubmissionDto,
    @Req() request: { user: JwtPayload }
  ) {
    return this.classroomsService.submitActivity(id, dto, request.user);
  }

  @Patch("submissions/:id/grade")
  @Roles("DOCENTE")
  gradeSubmission(
    @Param("id") id: string,
    @Body() dto: GradeSubmissionDto,
    @Req() request: { user: JwtPayload }
  ) {
    return this.classroomsService.gradeSubmission(id, dto, request.user);
  }
}

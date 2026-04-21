import { IsString, Length } from "class-validator";

export class CreateClassroomActivityDto {
  @IsString()
  @Length(1, 160)
  title!: string;

  @IsString()
  @Length(1, 2000)
  description!: string;
}

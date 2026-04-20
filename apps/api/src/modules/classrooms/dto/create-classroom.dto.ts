import { IsString, Length } from "class-validator";

export class CreateClassroomDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsString()
  @Length(1, 120)
  subject!: string;
}

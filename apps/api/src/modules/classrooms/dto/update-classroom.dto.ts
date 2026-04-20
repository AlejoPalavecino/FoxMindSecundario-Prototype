import { IsOptional, IsString, Length } from "class-validator";

export class UpdateClassroomDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  subject?: string;
}

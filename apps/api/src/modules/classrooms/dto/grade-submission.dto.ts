import { IsInt, IsString, Length, Max, Min } from "class-validator";

export class GradeSubmissionDto {
  @IsInt()
  @Min(1)
  @Max(10)
  score!: number;

  @IsString()
  @Length(5, 1000)
  feedback!: string;
}

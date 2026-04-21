import { IsString, Length } from "class-validator";

export class CreateSubmissionDto {
  @IsString()
  @Length(10, 10000)
  content!: string;
}

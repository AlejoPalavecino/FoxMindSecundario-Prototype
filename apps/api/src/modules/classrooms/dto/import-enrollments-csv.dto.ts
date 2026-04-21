import { IsString, MaxLength } from "class-validator";

export class ImportEnrollmentsCsvDto {
  @IsString()
  @MaxLength(1024 * 1024)
  csvContent!: string;
}

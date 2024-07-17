import { IsString } from "class-validator";

export class CreateSearchDto {
    @IsString()
    searchTerm: string;
}
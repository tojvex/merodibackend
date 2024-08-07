import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuthorDto {

    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsString()
    biography: string

    @IsString()
    imageUrl: string


}

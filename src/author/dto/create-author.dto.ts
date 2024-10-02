import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuthorDto {

    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsString()
    biography: string

    @IsOptional()
    @IsNumber()
    imageId: number

    @IsOptional()
    @IsArray()
    musics: number[]

    @IsOptional()
    @IsArray()
    albums: number[]


}

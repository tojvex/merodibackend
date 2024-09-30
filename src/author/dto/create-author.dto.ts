import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuthorDto {

    @IsString()
    firstName: string
    
    @IsOptional()
    @IsString()
    lastName: string

    @IsString()
    biography: string

    @IsOptional()
    @IsString()
    imageUrl: string

    @IsOptional()
    @IsArray()
    musics: Number[]

    @IsOptional()
    @IsArray()
    albums: Number[]


}

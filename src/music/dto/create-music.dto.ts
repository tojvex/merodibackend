import { IsArray, IsDecimal, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateMusicDto {

    @IsString()
    name: string


    @IsNumber()
    duration: number

    @IsUrl()
    imageUrl: string

    @IsOptional()
    @IsNumber()
    albumId: number

    @IsOptional()
    @IsArray()
    authors: Number[]

}

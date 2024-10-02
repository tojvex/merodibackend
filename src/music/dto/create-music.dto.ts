import { IsArray, IsDecimal, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateMusicDto {

    @IsString()
    name: string


    @IsNumber()
    duration: number

    @IsNumber()
    imageId: number

    @IsNumber()
    fileId: number

    @IsOptional()
    @IsNumber()
    albumId: number


    @IsOptional()
    @IsArray()
    authors: Number[]

}

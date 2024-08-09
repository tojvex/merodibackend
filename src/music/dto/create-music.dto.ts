import { IsArray, IsDecimal, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMusicDto {

    @IsString()
    name: string


    @IsNumber()
    duration: number

    @IsOptional()
    @IsNumber()
    albumId: number

    @IsOptional()
    @IsArray()
    authors: Number[]

}

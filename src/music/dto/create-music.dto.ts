import { IsDecimal, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMusicDto {

    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    artistId: number

    @IsNumber()
    duration: number

    @IsOptional()
    @IsNumber()
    albumId: number
}

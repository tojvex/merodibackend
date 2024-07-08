import { IsDecimal, IsNumber, IsString } from "class-validator";

export class CreateMusicDto {

    @IsString()
    name: string

    @IsNumber()
    artistId: number

    @IsNumber()
    duration: number
}

import { IsDecimal, IsNumber, IsString } from "class-validator";

export class CreateMusicDto {

    @IsString()
    name: string

    @IsNumber()
    duration: number

    @IsNumber()
    authorId: number


}

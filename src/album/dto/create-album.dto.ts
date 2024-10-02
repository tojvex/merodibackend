import { IsArray, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateAlbumDto {
    @IsString()
    title: string

    @IsString()
    releaseDate: string

    @IsString()
    description: string

    @IsNumber()
    @IsOptional()
    imageId: number

    @IsOptional()
    @IsArray()
    musics: Number[]

    @IsArray()
    authors: String[]
}

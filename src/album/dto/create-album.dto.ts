import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateAlbumDto {
    @IsString()
    title: string

    @IsString()
    releaseDate: string

    @IsOptional()
    @IsArray()
    musics: Number[]

    @IsOptional()
    @IsArray()
    authors: Number[]
}

import { IsArray, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateAlbumDto {
    @IsString()
    title: string

    @IsString()
    releaseDate: string

    @IsString()
    description: string

    @IsUrl()
    imageUrl: string

    @IsOptional()
    @IsArray()
    musics: Number[]

    @IsOptional()
    @IsArray()
    authors: Number[]
}

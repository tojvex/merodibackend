import { IsArray, IsNumber, IsOptional, IsString, IsUUID, IsUrl, MaxLength } from "class-validator";

export class CreatePlaylistDto {
    @IsString()
    @MaxLength(30)
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsString()
    @IsUrl()
    image: string;

    @IsNumber()
    userId: number;

    @IsArray()
    @IsNumber({}, {each: true })
    musicIds: number[];
}

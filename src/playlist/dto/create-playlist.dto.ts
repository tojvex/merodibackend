import { IsArray, IsNumber, IsOptional, IsString, IsUUID, IsUrl, MaxLength } from "class-validator";

export class CreatePlaylistDto {
    @IsString()
    @MaxLength(30)
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsString()
    @IsUrl()
    image: string;

    @IsUUID()
    userId: string;

    @IsArray()
    @IsNumber({}, {each: true })
    musicIds: number[];
}

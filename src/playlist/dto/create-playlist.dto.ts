import { IsArray, IsNumber, IsOptional, IsString, IsUUID, IsUrl, MaxLength } from "class-validator";

export class CreatePlaylistDto {
    @IsString()
    @MaxLength(30)
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNumber()
    @IsOptional()
    imageId: number

    @IsArray()
    userId: number[];
    
    @IsArray()
    @IsNumber({}, {each: true })
    musicIds: number[];

    @IsOptional()
    @IsNumber()
    authorId: number
}

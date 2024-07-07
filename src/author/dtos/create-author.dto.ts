import { IsNumber, IsString } from "class-validator";

export class CreateAuthorDto {

    @IsString()
    firstName: string

    


}
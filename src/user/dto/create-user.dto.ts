import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches} from "class-validator";
import { RoleEnum } from "src/auth/enums/roles.enums";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 255)
    name: string;

    @Length(3, 255)
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 255)
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
        message: 'Password too weak',
    })
    password: string;

    @IsString()
    role: RoleEnum;
}

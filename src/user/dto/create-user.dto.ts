import { IsEmail, IsNotEmpty, IsString, Length, Matches} from "class-validator";

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
    @Length(8, 20)
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
        message: 'Password too weak',
    })
    password: string;
}

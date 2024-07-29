import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/create-login.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepo: UserRepository) {}
  
  async login(data: LoginUserDto) {
    const user  = await this.usersRepo.findOneByEmail(data.email)
    const {password, ...rest} = user

    if(!user) {
      throw new UnauthorizedException('Access Denied')
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.password, 
      user.password
    )
    
    if(!isPasswordCorrect){
      throw new UnauthorizedException('Access Denied')
    }

    return rest
  
  }

}

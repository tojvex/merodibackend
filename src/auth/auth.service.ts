import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/create-login.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepo: UserRepository,
              private readonly jwtService: JwtService) {}
  
  async login(data: LoginUserDto) {
    const user  = await this.usersRepo.findOneByEmail(data.email)
    

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

    const jwtToken = await this.jwtService.signAsync({
      userId: user.id,
      name: user.name,
      role: user.role


    })

    return jwtToken
  
  }

}

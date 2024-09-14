import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/roles.enums';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  
  @Roles(RoleEnum.admin, RoleEnum.user)
  @Post()
  async create(@Body() createMusicDto: CreateMusicDto) {
    return await this.musicService.create(createMusicDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.user)
  @Get()
  async findAll() {
    return await this.musicService.findAll();
  }

  @Roles(RoleEnum.admin, RoleEnum.user)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.musicService.findOne(+id);
  }

  @Roles(RoleEnum.admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
    return await this.musicService.update(+id, updateMusicDto);
  }

  @Roles(RoleEnum.admin)
  @Delete(':id')
 async remove(@Param('id') id: string) {
    return await this.musicService.remove(+id);
  }
}

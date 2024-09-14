import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { RoleEnum } from 'src/auth/enums/roles.enums';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}


  @Roles(RoleEnum.admin, RoleEnum.user)
  @Post()
  async create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return await this.playlistService.create(createPlaylistDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.user)
  @Get()
  async findAll() {
    return await this.playlistService.findAll();
  }


  @Roles(RoleEnum.admin, RoleEnum.user)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.playlistService.findOne(+id);
  }

  @Roles(RoleEnum.admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return await this.playlistService.update(+id, updatePlaylistDto);
  }

  @Roles(RoleEnum.admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.playlistService.remove(+id);
  }
}

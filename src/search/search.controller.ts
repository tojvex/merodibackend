import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { query } from 'express';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query() query:  CreateSearchDto) {
    return this.searchService.search(query)

  }
}

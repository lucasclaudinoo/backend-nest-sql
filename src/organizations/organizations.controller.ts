import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/create-entity.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
@Controller('organizations')
@UseGuards(JwtAuthGuard) // Aplicando o JwtAuthGuard a todas as rotas do controller
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async findAll(
    @Query('search') query: string,
    @Query('page', ParseIntPipe) page: number = 0,
    @Query('pageSize', ParseIntPipe) pageSize: number = 5,
  ) {
    return this.organizationsService.findAll(query, page, pageSize);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findOne(id);
  }

  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Req() req: Request,
  ) {
    const userId = req.body.userId;
    return this.organizationsService.create(createOrganizationDto, userId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.remove(id);
  }
}

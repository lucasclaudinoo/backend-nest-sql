import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/create-entity.dto';
import { Organization } from './entities/organization.entities';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {
    this.removeAll();
  }

  async findAll(
    query: string,
    page: number,
    pageSize: number,
  ): Promise<{ totalReports: number; result: Organization[] }> {
    let whereClause = {};
    if (query) {
      whereClause = [
        { nomeFantasia: Like(`%${query}%`) },
        { regional: Like(`%${query}%`) },
        { especialidadesMedicas: Like(`%${query}%`) },
        ...(query.toLowerCase() === 'true' || query.toLowerCase() === 'false'
          ? [{ ativa: query.toLowerCase() === 'true' }]
          : []),
      ];
    }

    const [result, totalReports] =
      await this.organizationsRepository.findAndCount({
        where: whereClause,
        skip: page * pageSize,
        take: pageSize,
      });

    return { totalReports, result };
  }

  async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationsRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
    userId: number,
  ): Promise<Organization> {
    const organization = this.organizationsRepository.create(
      createOrganizationDto,
    );
    organization.userId = userId; // Associa a organização ao usuário
    return this.organizationsRepository.save(organization);
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    await this.organizationsRepository.update(id, updateOrganizationDto);
    const updatedOrganization = await this.findOne(id);
    return updatedOrganization;
  }

  async remove(id: number): Promise<void> {
    await this.organizationsRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.organizationsRepository.clear();
  }
}

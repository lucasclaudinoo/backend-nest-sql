import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/create-entity.dto';
import { Organization } from './entities/organization.entities';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {
    this.createMockOrganizations();
  }

  async findAll(query: string, page: number, pageSize: number): Promise<{ totalReports: number; result: Organization[] }> {
    let whereClause = {};
    if (query) {
      whereClause = [
        { name: Like(`%${query}%`) },
        { region: Like(`%${query}%`) },
        { specialties: Like(`%${query}%`) },
        // Convertendo o query para booleano se for possível
        ...(query.toLowerCase() === 'true' || query.toLowerCase() === 'false'
          ? [{ active: query.toLowerCase() === 'true' }]
          : []),
      ];
    }

    const [result, totalReports] = await this.organizationsRepository.findAndCount({
      where: whereClause,
      skip: page * pageSize,
      take: pageSize,
    });

    return { totalReports, result };
  }

  async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationsRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const organization = this.organizationsRepository.create(createOrganizationDto);
    return this.organizationsRepository.save(organization);
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    await this.organizationsRepository.update(id, updateOrganizationDto);
    const updatedOrganization = await this.findOne(id);
    return updatedOrganization;
  }

  async remove(id: number): Promise<void> {
    await this.organizationsRepository.delete(id);
  }

  async createMockOrganizations() {
    const mockOrganizations: CreateOrganizationDto[] = [
      { name: 'Organization 1', region: 'Region 1', specialties: 'Specialty 1', active: true },
      { name: 'Organization 2', region: 'Region 2', specialties: 'Specialty 2', active: false },
      { name: 'Organization 3', region: 'Region 3', specialties: 'Specialty 2', active: true },
      { name: 'Organization 4', region: 'Region 4', specialties: 'Specialty 2', active: false },
      { name: 'Organization 5', region: 'Region 5', specialties: 'Specialty 2', active: true },
      { name: 'Organization 6', region: 'Region 6', specialties: 'Specialty 2', active: true },
    ];

    for (const mockOrganization of mockOrganizations) {
      const existingOrganization = await this.organizationsRepository.findOne({ where: { name: mockOrganization.name } });
      console.log('Mock organizations created:', existingOrganization);
      if (!existingOrganization) {
        const organization = this.organizationsRepository.create(mockOrganization);
        await this.organizationsRepository.save(organization);
      }
    }
  }
}

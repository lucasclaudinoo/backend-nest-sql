export class CreateOrganizationDto {
  name: string;
  region: string;
  specialties: string;
  active: boolean;
}

export class UpdateOrganizationDto {
  name?: string;
  region?: string;
  specialties?: string;
  active?: boolean;
}
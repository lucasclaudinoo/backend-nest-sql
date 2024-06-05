import { IsNotEmpty, IsBoolean, IsDate, ArrayNotEmpty } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  razaoSocial: string;

  @IsNotEmpty()
  nomeFantasia: string;

  @IsNotEmpty()
  cnpj: string;

  @IsNotEmpty()
  regional: string;

  @IsDate()
  dataInauguracao: Date;

  @ArrayNotEmpty()
  especialidadesMedicas: string[];

  @IsBoolean()
  ativa: boolean;
}

export class UpdateOrganizationDto {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  regional: string;
  dataInauguracao: Date;
  especialidadesMedicas: string[];
  ativa: boolean;
}

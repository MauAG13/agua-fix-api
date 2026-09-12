import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  address: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  @IsNotEmpty({ message: 'La severidad es obligatoria' })
  @IsIn(['low', 'medium', 'high'], {
    message: 'La severidad debe ser uno de los siguientes valores: low, medium, high',
  })
  severity: string;

  @IsNotEmpty({ message: 'El teléfono de contacto es obligatorio' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  reporterPhone: string;
}

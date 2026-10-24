import { CreateReportDto } from '../dto/create-report.dto';

export function generateReportTemplate(dto: CreateReportDto, photoUrl: string): string {
  const severityColors: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: '#fee2e2', text: '#991b1b', label: 'ALTA' },
    medium: { bg: '#fef3c7', text: '#92400e', label: 'MEDIA' },
    low: { bg: '#e0f2fe', text: '#075985', label: 'BAJA' },
  };

  const severityInfo = severityColors[dto.severity?.toLowerCase()] || {
    bg: '#f3f4f6',
    text: '#374151',
    label: (dto.severity || 'N/A').toUpperCase(),
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Reporte de Fuga de Agua</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #1f2937;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <tr>
      <td style="background-color: #0284c7; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: bold;">Alerta de Fuga de Agua</h1>
        <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Sistema Municipal de Agua - Cuadrilla de Mantenimiento</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <p style="margin-top: 0; font-size: 15px; line-height: 1.5;">
          Se ha recibido un nuevo reporte ciudadano de fuga de agua en la vía pública. A continuación se presentan los detalles para su pronta atención:
        </p>
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
          <tr style="background-color: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; width: 35%; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Severidad</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
              <span style="display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: bold; border-radius: 12px; background-color: ${severityInfo.bg}; color: ${severityInfo.text};">
                ${severityInfo.label}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Dirección / Referencia</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${dto.address}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Descripción</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px; line-height: 1.4;">${dto.description}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Teléfono de Contacto</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><a href="tel:${dto.reporterPhone}" style="color: #0284c7; text-decoration: none; font-weight: bold;">${dto.reporterPhone}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; color: #4b5563; vertical-align: top;">Fotografía de la Fuga</td>
            <td style="padding: 12px 16px;">
              <a href="${photoUrl}" target="_blank" style="text-decoration: none;">
                <img src="${photoUrl}" alt="Foto de la fuga de agua" style="max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #d1d5db; display: block; margin-bottom: 6px;" />
                <span style="font-size: 12px; color: #0284c7;">Ver imagen en tamaño completo</span>
              </a>
            </td>
          </tr>
        </table>

        <p style="font-size: 13px; color: #6b7280; line-height: 1.4; margin-bottom: 0;">
          Por favor acuda al lugar del reporte o contacte al ciudadano para coordinar las reparaciones correspondientes.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
        Este es un correo automático generado por el sistema de Agua Fix.
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

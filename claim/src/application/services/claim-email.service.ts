import { Injectable } from '@nestjs/common';
import { CreateClaimDTO, RequestType } from '../dto/create-claim.dto';

@Injectable()
export class ClaimEmailService {
  buildSubject(dto: CreateClaimDTO, trackingCode: string): string {
    const tipo = dto.requestType === RequestType.Q ? 'Queja' : 'Reclamo';

    return `Nuevo ${tipo} (${trackingCode}) de ${dto.firstName} ${dto.lastName}`;
  }

  buildHtmlBody(
    dto: CreateClaimDTO,
    trackingCode: string,
    submissionDate: string,
  ): string {
    const requestDate = dto.requestDate.split('T')[0];
    return `
      <html>
        <head>
          <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
      }
      h2 {
        color: #0066cc;
        border-bottom: 2px solid #0066cc;
        padding-bottom: 5px;
      }
      .section-title {
        margin-top: 20px;
        font-size: 15px;
        font-weight: bold;
        color: #444;
        border-left: 4px solid #0066cc;
        padding-left: 8px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th {
        text-align: left;
        background-color: #f5f7fa;
        padding: 8px;
        border: 1px solid #ddd;
        width: 40%;
      }
      td {
        padding: 8px;
        border: 1px solid #ddd;
      }
      p {
        margin: 5px 0;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        text-align: center;
        color: #888;
      }
    </style>
        </head>
        <body>
  <h2>Se ha registrado ${
    dto.requestType === "Q" ? 'un nuevo reclamo' : 'una nueva queja'
  }</h2>
  <p><strong>Código de seguimiento:</strong> ${trackingCode}</p>
  <p><strong>Fecha de registro:</strong> ${
    requestDate || submissionDate
  }</p>

  <div class="section-title">Detalles del reclamo</div>
  <table>
    <tr><th>Nombre</th><td>${dto.firstName} ${dto.lastName}</td></tr>
    <tr><th>Correo electrónico</th><td>${dto.email}</td></tr>
    <tr><th>Teléfono</th><td>${dto.phone || 'N/A'}</td></tr>
    <tr><th>Número de documento</th><td>${dto.documentNumber || 'N/A'}</td></tr>
    <tr><th>Número de pedido</th><td>${dto.orderNumber || 'N/A'}</td></tr>
    <tr><th>Orden del cliente</th><td>${dto.customerOrder || 'N/A'}</td></tr>
  </table>

  <div class="section-title">Información del proveedor</div>
  <table>
    <tr><th>Nombre del proveedor</th><td>${dto.providerName || 'N/A'}</td></tr>
  </table>

  <div class="section-title">Información de la dirección</div>
  <table>
    <tr><th>Dirección</th><td>${dto.address || 'N/A'}</td></tr>
    <tr><th>Referencia</th><td>${dto.addressReference || 'N/A'}</td></tr>
  </table>

  <div class="section-title">Detalle del incidente</div>
  <p>${dto.incidentDetail || 'N/A'}</p>

  <div class="section-title">Bien contratado</div>
  <table>
    <tr><th>Tipo</th><td>${dto.contractedGoodType || 'N/A'}</td></tr>
    <tr><th>Detalle</th><td>${dto.contractedGoodDetail || 'N/A'}</td></tr>
  </table>

  <div class="section-title">Información legal</div>
  <table>
    <tr><th>Menor de edad</th><td>${dto.underAge ? 'Sí' : 'No'}</td></tr>
    <tr><th>Datos del apoderado</th><td>${dto.guardianData || 'N/A'}</td></tr>
  </table>

  <div class="section-title">Autorización</div>
  <table>
    <tr><th>Autoriza tratamiento de datos</th><td>${
      dto.authorizeData ? 'Sí' : 'No'
    }</td></tr>
  </table>
</body>

      </html>
    `;
  }
}

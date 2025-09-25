# 🚀 Arquitectura Serverless con Terraform

Este proyecto implementa un escenario **serverless** en AWS para manejar formularios bajo un dominio corporativo.  
Los componentes se gestionan con **Terraform** y se integran con un dominio externo (GoDaddy en este ejemplo).

---

## 📦 Componentes desplegados

- **S3** → Bucket para frontend estático (`index.html`).
- **CloudFront** → CDN con SSL para servir el contenido.
- **ACM (AWS Certificate Manager)** → Certificado SSL validado vía DNS.
- **API Gateway** → Endpoint REST para manejar envíos de formularios.
- **Lambda** → Función que procesa envíos (dummy incluida para pruebas).
- **DynamoDB** → Tabla para almacenar formularios enviados.

---

## 🔑 Requisitos previos

1. **Instalar Terraform**  
   [Instrucciones aquí](https://developer.hashicorp.com/terraform/downloads).

2. **Configurar credenciales de AWS CLI**  
   ```bash
   aws configure


## 🌐 Configuración de Dominio y Certificado SSL  

### 1. Solicitud de certificado en **ACM (AWS Certificate Manager)**  
1. Ingresa a la consola de AWS y navega a **Certificate Manager (ACM)**.  
2. Haz clic en **Request a certificate** → **Request a public certificate**.  
3. Ingresa el dominio completo que usarás para los formularios (ejemplo: `forms.empresa.com`).  
   - Si deseas cubrir subdominios, agrega también `*.empresa.com`.  
4. Selecciona **DNS validation** (recomendado).  
5. Confirma la solicitud.  

> ⚠️ **Nota:** El certificado debe generarse en la región **us-east-1 (N. Virginia)** ya que se asociará a **CloudFront**.  

---

### 2. Agregar registros DNS en tu proveedor (GoDaddy en este ejemplo)  
1. Ingresa al panel de administración de tu dominio en GoDaddy.  
2. Ve a la configuración de **Zona DNS**.  
3. Agrega los registros que ACM te proporcionó:  
   - Registros **CNAME de validación** (generalmente con nombres aleatorios).  
   - Mantén estos registros activos; AWS los usa para validar y renovar automáticamente el certificado.  

---

### 3. Esperar la validación del certificado  
- El estado del certificado en ACM cambiará de **Pending validation** → **Issued**.  
- El tiempo depende de la propagación DNS (suele tardar pocos minutos).  

---

### 4. Configurar el dominio en **CloudFront**  
1. Ve a la consola de **CloudFront**.  
2. Edita la distribución creada por Terraform.  
3. En la sección **Alternate Domain Names (CNAMEs)** agrega tu dominio (`forms.empresa.com`).  
4. En **SSL Certificate**, selecciona **Custom SSL Certificate** → el certificado que creaste en ACM.  
5. Guarda los cambios y espera a que la distribución se vuelva a propagar (~10–20 min).  

---

### 5. Apuntar el dominio a CloudFront  
1. En la **Zona DNS** de GoDaddy agrega un registro:  
   - **CNAME** → `forms.empresa.com` apuntando al **Domain Name** de tu distribución CloudFront (ejemplo: `d1234567abcd.cloudfront.net`).  
2. Espera la propagación DNS (puede tardar de 5 a 30 minutos).  

---

### 6. Probar la configuración  
1. Accede en tu navegador a:  https://forms.empresa.com


## 🛠️ Troubleshooting (Errores Comunes)

### ❌ El certificado en ACM no cambia a *Issued*
- Verifica que los registros **CNAME** de validación estén creados en GoDaddy.  
- Asegúrate de que los valores de **Host** y **Value** sean exactamente los que te da AWS (sin agregar el dominio completo en el host).  
- Espera la propagación DNS (puede tardar hasta 1 hora en algunos casos).  

---

### ❌ Error: *InvalidViewerCertificate* en CloudFront
- Revisa que el certificado esté creado en la región **us-east-1 (N. Virginia)**.  
- CloudFront **solo acepta certificados** de ACM en esa región.  

---

### ❌ El dominio `forms.empresa.com` no resuelve
- Verifica en la **Zona DNS de GoDaddy** que el registro CNAME esté apuntando al **Domain Name** de CloudFront (ejemplo: `d1234567abcd.cloudfront.net`).  
- Usa la herramienta `dig` o `nslookup` para confirmar que el CNAME esté propagado:  
  ```bash
  nslookup forms.empresa.com

---

### ❌ No se refleja cambios en el frontend
- Para actualizar el cache de cloudfront puedes hacerlo directamente desde el servicio o por consola usando el aws cli.
`aws cloudfront create-invalidation --distribution-id E9Y3MARBGX7W9 --paths "/*"`

## 🚦 Flujo de despliegue completo

1. **Inicializar y aplicar infraestructura con Terraform**  
   ```bash
   terraform init
   terraform apply

2. **Subir los archivos del frontend al bucket S3**  
   ```aws s3 sync ./frontend s3://<nombre-del-bucket>

3. **Esperar propagación de CloudFront**  
   Puede demorar aproximadamente 10–15 minutos en reflejar los cambios.

4. **Acceder al dominio personalizado**
   https://forms.empresa.com
variable "aws_region" {
  description = "AWS region for most resources. Note: CloudFront ACM cert must be in us-east-1."
  type        = string
  default     = "us-east-1"
}

variable "aws_env" {
  description = "AWS environment."
  type        = string
  default     = "dev"
}

variable "domain_name" {
  description = "Root domain, e.g. tudominio.com"
  type        = string
  default     = ""
}

variable "subdomain" {
  description = "Subdomain to use for the site (e.g. forms)"
  type        = string
  default     = "forms"
}

variable "certificate_arn" {
  description = "ACM certificate ARN for CloudFront (must be in us-east-1)"
  type        = string
  default     = ""
}

variable "lambda_source_dir" {
  description = "Path to lambda source folder to be zipped (relative to repo root). Example: lambda_src"
  type        = string
  default     = "lambda_src"
}

variable "tags" {
  description = "Common tags map"
  type        = map(string)
  default     = {}
}

variable "aliases" {
  description = "Lista de subdominios/dominios adicionales para el certificado"
  type = list(string)
  default     = []
}

variable "repository_form" {
  description = "Repositorio del proyecto"
  type        = string
}
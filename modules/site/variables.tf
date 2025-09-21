variable "certificate_arn" {
  type = string
  default = ""
}

variable "tags" {
  type = map(string)
  default = {}
}

variable "fqdn" {
  type        = string
  description = "Nombre del bucket del frontend"
}

variable "aliases" {
  type        = list(string)
  description = "Lista de subdominios/dominos adicionales para CloudFront"
  default     = []
}

variable "bucket_id" {
  type        = string
  description = "ID del bucket S3 usado como origen de CloudFront"
}

variable "bucket_arn" {
  type        = string
  description = "ARN del bucket S3 usado como origen de CloudFront"
}

variable "bucket_regional_domain_name" {
  type        = string
  description = "Domain name del bucket S3 usado como origen de CloudFront"
}


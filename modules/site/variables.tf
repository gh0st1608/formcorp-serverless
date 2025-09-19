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
  description = "Dominio principal"
}

variable "aliases" {
  type        = list(string)
  description = "Lista de subdominios/dominos adicionales para CloudFront"
  default     = []
}


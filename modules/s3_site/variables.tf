variable "fqdn" {
  type        = string
  description = "Nombre bucket site"
}

variable "tags" {
  type    = map(string)
  default = {}
}
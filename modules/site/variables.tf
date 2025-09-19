variable "fqdn" {
  type = string
}

variable "certificate_arn" {
  type = string
  default = ""
}

variable "tags" {
  type = map(string)
  default = {}
}

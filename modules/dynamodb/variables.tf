variable "name" {
  type        = string
  description = "Table name"
}

variable "billing_mode" {
  type    = string
  default = "PAY_PER_REQUEST"
}

variable "tags" {
  type    = map(string)
  default = {}
}

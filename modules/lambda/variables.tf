variable "function_name" {
  type = string
}

variable "runtime" {
  type    = string
  default = "nodejs18.x"
}

variable "handler" {
  type    = string
  default = "index.handler"
}

variable "source_dir" {
  type        = string
  description = "Relative path to folder with lambda source (will be zipped)."
}

variable "env_variables" {
  type    = map(string)
  default = {}
}

variable "tags" {
  type    = map(string)
  default = {}
}

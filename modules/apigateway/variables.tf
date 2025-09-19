variable "name" {
  type = string
}

variable "lambda_arn" {
  type = string
}

variable "lambda_name" {
  type = string
}

variable "tags" {
  type = map(string)
  default = {}
}

variable "aws_region" {
  type        = string
  description = "AWS region where API Gateway will be deployed"
}

variable "aws_env" {
  type        = string
  description = "AWS environment"
}
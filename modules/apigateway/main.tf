#######################################
# API Gateway
#######################################

resource "aws_api_gateway_rest_api" "this" {
  name        = var.name
  description = "API for forms submission"
  tags        = var.tags
}

#######################################
# Resources
#######################################

resource "aws_api_gateway_resource" "claims" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "claims"
}

resource "aws_api_gateway_resource" "register" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.claims.id
  path_part   = "register"
}

#######################################
# POST /claims/register
#######################################

resource "aws_api_gateway_method" "post_register" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.register.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_proxy_register" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.register.id
  http_method             = aws_api_gateway_method.post_register.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${var.lambda_arn}/invocations"
}

resource "aws_lambda_permission" "forms_apgw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.this.execution_arn}/*/POST/claims/register"
}

#######################################
# OPTIONS /claims/register (CORS)
#######################################

resource "aws_api_gateway_method" "options_register" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.register.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_register" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.register.id
  http_method             = aws_api_gateway_method.options_register.http_method
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "options_register" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.register.id
  http_method = aws_api_gateway_method.options_register.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_register" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.register.id
  http_method = aws_api_gateway_method.options_register.http_method
  status_code = aws_api_gateway_method_response.options_register.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    # mientras pruebas puedes dejar "*" o limitar a tus 3 frontends
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

#######################################
# Deployment
#######################################

resource "aws_api_gateway_deployment" "this" {
  depends_on = [
    aws_api_gateway_integration.lambda_proxy_register,
    aws_api_gateway_integration.options_register
  ]

  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    # fuerza redeploy cuando cambie el lambda
    redeploy = sha1(var.lambda_arn)
  }

  lifecycle {
    create_before_destroy = true
  }
}

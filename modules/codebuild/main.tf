resource "aws_codebuild_project" "design" {
  name          = "build-design-formcorp"
  description   = "Compila y despliega el diseño en S3"
  build_timeout = 15
  service_role  = var.codebuild_service_role_arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type = "NO_CACHE"
  }

  environment {
    compute_type                = "BUILD_LAMBDA_4GB"
    image                       = "aws/codebuild/amazonlinux-x86_64-lambda-standard:nodejs20"
    type                        = "LINUX_LAMBDA_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = false
  }

  logs_config {
    cloudwatch_logs {
      status      = "ENABLED"
      group_name  = ""
      stream_name = ""
    }
    s3_logs {
      status = "DISABLED"
    }
  }

  source {
    type            = "GITHUB"
    location        = var.repository
    buildspec       = "api/deploy/buildspec.yaml"
    git_clone_depth = 1

    git_submodules_config {
      fetch_submodules = false
    }
  }
}

resource "aws_codebuild_webhook" "design" {
  project_name = aws_codebuild_project.design.name
  build_type   = "BUILD" # compilación normal

  filter_group {
    filter {
      type    = "EVENT"
      pattern = "PUSH"
    }

    filter {
      type    = "HEAD_REF"
      pattern = "^refs/heads/design$"
    }
  }
}



resource "aws_codebuild_project" "claim_lambda" {
  name          = "build-claim-lambda"
  description   = "Compila, empaqueta y actualiza la Lambda cargocom-claim-service"
  build_timeout = 20
  service_role  = var.codebuild_service_role_arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type = "NO_CACHE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_MEDIUM"
    image                       = "aws/codebuild/standard:7.0" # Amazon Linux 2 + Node.js 20 soportado
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = false

    environment_variable {
      name  = "S3_BUCKET"
      value = "cargocom-claim-source"
    }

    environment_variable {
      name  = "ZIP_KEY"
      value = "claim/lambda.zip"
    }

    environment_variable {
      name  = "LAMBDA_NAME"
      value = "cargocom-claim-service"
    }
  }

  logs_config {
    cloudwatch_logs {
      status      = "ENABLED"
      group_name  = "/aws/codebuild/build-claim-lambda"
      stream_name = "lambda"
    }
    s3_logs {
      status = "DISABLED"
    }
  }

  source {
    type            = "GITHUB"
    location        = var.repository
    buildspec       = "claim/buildspec.yaml"
    git_clone_depth = 1

    git_submodules_config {
      fetch_submodules = false
    }
  }

}

resource "aws_codebuild_webhook" "claim_lambda" {
  project_name = aws_codebuild_project.claim_lambda.name
  build_type   = "BUILD"

  filter_group {
    filter {
      type    = "EVENT"
      pattern = "PUSH"
    }

    filter {
      type    = "HEAD_REF"
      pattern = "^refs/heads/micros$" # ajusta a la rama donde tengas tu Lambda
    }
  }
}

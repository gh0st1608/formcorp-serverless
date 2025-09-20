terraform {
  backend "remote" {
    organization = "solutionserj"

    workspaces {
      name = "formcorp-serverless"
    }
  }
}
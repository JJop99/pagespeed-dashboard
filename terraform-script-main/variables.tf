variable "prj_name" {
  type        = string
  description = "Project Slugged Name"
  default     = "Jack-TF"
}

variable "aws_region" {
  type        = string
  description = "AWS Region"
  default     = "eu-central-1"
}

variable "aws_profile" {
  type        = string
  description = "Name of the local AWS Profile"
  default     = "default"
}

variable "azs" {
  description = "Availability Zones"
  type        = list(any)
  default     = ["eu-central-1a", "eu-central-1b"]
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "123.0.0.0/16"
}

# variable "private_subnets" {
#   description = "Private Subnets CIDR"
#   type        = list(any)
#   default     = ["123.0.11.0/24", "123.0.12.0/24"]
# }

variable "public_subnets" {
  description = "Public Subnets CIDR"
  type        = list(any)
  default     = ["123.0.21.0/24", "123.0.22.0/24"]
}

variable "keypair" {
  description = "SSH Key"
  type        = map(any)
  default = {
    key_name   = "jacopo.jop"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDUmRq8rFPZDwBXphwCNOGthFNBDK6KqbiyDDRjVryw4q4paSjkIlmgB61/WIZd4TxJfylqcL6Rn95QMte0wTr9aHi+49TBVGANYOwJbrF3tzfT3CaEFBWFIm8ycqe5F7+CPs496YYGcjClqajBH1SDo82sxFd9W5mvTFpKt4OuDf0To1OnJSFgKYvBAX5YBvuoxhMPdPCMNhU+0fX7QADpuQvtWVEduqTRPA7Kgl3AbCx8OWAxAtEFwLBpeTJYkrsn9XTtksstUoowpz1QU1bkmYo+VPEXQ7VuF0guJ/Uwt4P5qLtPAmfTiQWKiLKVRuQr7xMQWDvWdsITGkkAowGn jacopo@MBP-di-Jacopo"
  }
}

variable "docker_registry" {
  description = "Docker Registry data"
  type        = map(any)
  default = {
    registry = "registry.gitlab.com"
    username = "jacopo.jop"
    password = "glpat-GHdxzPKfyV_DeSs5fxA3"
    image    = "registry.gitlab.com/mumble1/experiments/pagespeed-dashboard/pagespeed-dashboard:latest"
  }
}

# Domain www.terraform-mumble-test.com
# AWS Account 152006163228
variable "deploy_domain_id" {
  description = "Deploy domain Zone ID"
  type        = string
  default     = "Z07637113DG1FCACDWH2I"
}

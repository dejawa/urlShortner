
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${join("-", compact(list(var.env, data.terraform_remote_state.global.outputs.project)))}"
  cidr = "10.0.0.0/16"

  azs             = var.region_zones
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  db_subnets      = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true

  # enable_vpn_gateway = true
  external_nat_ip_ids = aws_eip.nat.*.id

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_eip" "nat" {
  count = 2

  vpc = true
}
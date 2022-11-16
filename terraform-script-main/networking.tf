# Create VPC
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = "VPC-${var.prj_name}"
  }
}

# Create public subnets
resource "aws_subnet" "public_subnets" {
  vpc_id                  = aws_vpc.main.id
  count                   = length(var.azs)
  cidr_block              = element(var.public_subnets, count.index)
  availability_zone       = element(var.azs, count.index)
  map_public_ip_on_launch = true

  tags = {
    Name = "Public Subnet ${count.index + 1}"
  }
}

# Create IGW
resource "aws_internet_gateway" "main-igw-01" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "Internet Gateway 01"
  }
}

# Single route table for public subnet
resource "aws_route_table" "public-rtable" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "Routing Table Public 01"
  }
}

# Add routes to public-rtable
resource "aws_route" "public-rtable" {
  route_table_id         = aws_route_table.public-rtable.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main-igw-01.id
}

# Route table association public subnets
resource "aws_route_table_association" "public-subnet-association" {
  count          = length(var.public_subnets)
  subnet_id      = element(aws_subnet.public_subnets.*.id, count.index)
  route_table_id = aws_route_table.public-rtable.id
}

# 
# Commented everything related to Private Subnets, NAT e Private Routing Tables
# 
# Create private subnets
# resource "aws_subnet" "private_subnets" {
#   vpc_id            = aws_vpc.main.id
#   count             = length(var.azs)
#   cidr_block        = element(var.private_subnets, count.index)
#   availability_zone = element(var.azs, count.index)

#   tags = {
#     Name = "Private Subnet ${count.index + 1}"
#   }
# }

# Private route tables
# resource "aws_route_table" "private-rtable" {
#   count  = length(var.private_subnets)
#   vpc_id = aws_vpc.main.id

#   tags = {
#     Name = "Routing Table Private ${count.index + 1}"
#   }
# }

# Route table association private subnets
# resource "aws_route_table_association" "private-subnet-association" {
#   count          = length(var.private_subnets)
#   subnet_id      = element(aws_subnet.private_subnets.*.id, count.index)
#   route_table_id = element(aws_route_table.private-rtable.*.id, count.index)
# }

# EIP
# resource "aws_eip" "nat-eip" {
#   count = length(var.azs)
#   vpc   = true

#   tags = {
#     Name = "Elastic IP ${count.index + 1}"
#   }
# }

# NAT gateways
# resource "aws_nat_gateway" "prod-nat-gateway" {
#   count         = length(var.azs)
#   allocation_id = element(aws_eip.nat-eip.*.id, count.index)
#   subnet_id     = element(aws_subnet.public_subnets.*.id, count.index)

#   tags = {
#     Name = "NAT ${count.index + 1}"
#   }
# }

# Add routes to private-rtable
# resource "aws_route" "subnets-private-rtable" {
#   count                  = length(var.azs)
#   route_table_id         = element(aws_route_table.private-rtable.*.id, count.index)
#   destination_cidr_block = "0.0.0.0/0"
#   nat_gateway_id         = element(aws_nat_gateway.prod-nat-gateway.*.id, count.index)
# }

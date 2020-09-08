resource "aws_rds_cluster_instance" "cluster_instances" {
  count                = 2
  identifier           = "shortener-cluster-demo-${count.index}"
  cluster_identifier   = aws_rds_cluster.default.id
  instance_class       = "db.r4.large"
  engine               = aws_rds_cluster.default.engine
  engine_version       = aws_rds_cluster.default.engine_version
  db_subnet_group_name = aws_db_subnet_group.default.id
}

resource "aws_rds_cluster" "default" {
  cluster_identifier = "shortener-cluster-demo"
  availability_zones = ["ap-northeast-2a", "ap-northeast-2b", "ap-northeast-2c"]
  database_name      = "urls"
  master_username    = "postgres"
  master_password    = "barbut8chars"
}

resource "aws_db_subnet_group" "default" {
  name       = "main"
  subnet_ids = module.vpc.public_subnets.id

  tags = {
    Name = "My DB subnet group"
  }
}
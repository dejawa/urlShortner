resource "aws_elasticache_cluster" "shortner" {
  cluster_id           = "cluster-shortner"
  engine               = "redis"
  subnet_group_name    = aws_elasticache_subnet_group.shortner.id
  node_type            = "cache.m4.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis3.2"
  engine_version       = "3.2.10"
  port                 = 6379
}


resource "aws_elasticache_subnet_group" "shortner" {
  name       = "tf-test-cache-subnet"
  subnet_ids = [aws_subnet.foo.id]
}
data "cloudflare_zone" "main" {
  zone_id = var.zone_id
}

output "nameservers" {
  description = "Set these nameservers at dd24"
  value       = data.cloudflare_zone.main.name_servers
}

output "worker_name" {
  description = "Deployed worker name"
  value       = cloudflare_workers_script.aem_prod.script_name
}

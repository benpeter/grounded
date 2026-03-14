# ---------------------------------------------------------------------------
# AEM EDS Cloudflare Worker
# Source: https://github.com/adobe/aem-cloudflare-prod-worker
# ---------------------------------------------------------------------------

resource "cloudflare_workers_script" "aem_prod" {
  account_id  = var.account_id
  script_name = "grounded-aem-prod"

  content     = file("${path.module}/../worker/index.mjs")
  main_module = "index.mjs"

  bindings = [
    {
      name = "ORIGIN_HOSTNAME"
      type = "plain_text"
      text = var.origin_hostname
    },
    {
      name = "PUSH_INVALIDATION"
      type = "plain_text"
      text = "enabled"
    },
  ]
}

resource "cloudflare_workers_route" "apex" {
  zone_id = var.zone_id
  pattern = "${var.domain}/*"
  script  = cloudflare_workers_script.aem_prod.script_name
}

resource "cloudflare_workers_route" "www" {
  zone_id = var.zone_id
  pattern = "www.${var.domain}/*"
  script  = cloudflare_workers_script.aem_prod.script_name
}

# Nura (nurashop.it) — Repo Conventions

> Claude in the Nura repo. Audience: Gianmarco + Gianmaria.
> Strategy lives in Notion; this file is operational.

## READ FIRST

**Notion READ FIRST page:** https://www.notion.so/34915a619d1f81868869c6dc2ef2c930
**Notion hub:** https://www.notion.so/32a15a619d1f81d19945c37fef560b80

Always fetch the READ FIRST page first on every Nura session — it carries the current business model, launch mechanic, team, Shopify-era stack, conventions, the data-source table, and the changelog. If this file ever drifts from the Notion page, trust Notion.

## Where things live

- **Code:** this repo (`~/Projects/nurashop.it/`) — currently a static landing site (HTML, no framework).
- **Design system:** `DESIGN.md` in this repo (Superhuman-inspired) — colors, typography, layout language for the Shopify-frontend rebuild.
- **Specs/plans:** `~/Documents/Cortex/{specs,plans}/` — Nura strategy work lives here, not in this repo.
  - Notion OS backbone: `~/Documents/Cortex/specs/2026-04-21-nura-notion-os-backbone-design.md` and `~/Documents/Cortex/plans/2026-04-21-nura-notion-os-backbone.md`.
- **Notion exports** (read-only mirror for Claude): `~/Documents/Cortex/notion/nura/`.
- **Strategy + decisions:** Notion (see hub). Don't restate strategy in this repo.

## Conventions

- **Workshop conventions** (commit style, scratch handling, recall semantic memory) live once in `~/Documents/Cortex/CLAUDE.md` — defer there rather than duplicating.
- **MCP fan-out** (per Notion READ FIRST): website scrapes via Firecrawl; social/reviews/trends via Apify; Notion writes via Notion MCP (never manual copy-paste); Shopify (once provisioned) via Shopify MCP. Secrets in 1Password vault `nura` — never paste into Notion or chat.
- **Filippo Aglietti is NOT on this project.** He belongs only to syllabi.online. Never add him to any Nura page or repo.

## Stack (now → planned)

- **Domain:** [nurashop.it](https://nurashop.it) (GoDaddy).
- **Hosting now:** Vercel (static landing).
- **Repo:** `paglieranigianmarco-collab/nurashop.it`.
- **Planned (D1 2026-04-19):** Shopify (frontend, catalog, checkout, subscriptions app TBD) + Stripe via Shopify Payments + Klaviyo + WhatsApp Business. Vercel/Supabase/Next.js stack retired at D1. See Notion → Ops → Tech & Repo for the live plan.

## Current state (volatile — verify against Notion)

- **Pre-launch.** Active scope is landing-page polish + Notion OS execution.
- **Notion OS backbone shipped 2026-04-22** on Cortex branch `feature/nura-notion-os-backbone` (14 commits, unmerged). Open items there are manual Notion UI actions, not code.
- **Launch mechanic:** 20% Founding-Member discount, 500-slot cap, locked-for-life while subscription uninterrupted, no re-entry after cancel (D2). The box model was dropped 2026-04-19.
- **Latest commits** (this repo): font/design tweaks. Check `git log --oneline -5` for the live state.

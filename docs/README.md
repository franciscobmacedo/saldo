# Saldo Documentation App

This Next.js + Nextra site hosts the docs for the Saldo library (dependent and independent worker simulators, API reference, examples, and tax tables).

## Prerequisites

- Node.js 18+
- pnpm

## Local development

From the repo root (ensures the library is built and docs deps are installed):

```bash
pnpm saldo:docs
```

Or work inside this folder:

```bash
cd docs
pnpm install
pnpm dev
```

Visit http://localhost:3000/docs to browse the docs.

## Production build

```bash
cd docs
pnpm install
pnpm build
```

The site uses the published `saldo` package. If you want to preview local changes to the library, build it in the repo root (`pnpm build`) and use `pnpm link`/`pnpm install ..` overrides as needed.

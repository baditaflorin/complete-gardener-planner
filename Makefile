SHELL := /bin/bash
GO_PACKAGES := ./cmd/... ./internal/...
PAGES_PORT ?= 4173
VERSION := $(shell node -p "require('./package.json').version")

.PHONY: help install-hooks dev build data test test-integration smoke lint fmt pages-preview docker-build docker-push release compose-up compose-down clean hooks-pre-commit hooks-commit-msg hooks-pre-push security

help:
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_-]+:.*##/ {printf "%-22s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install-hooks: ## Wire local git hooks
	git config core.hooksPath .githooks

dev: data ## Run the frontend dev server
	npm run dev -- --host 127.0.0.1

build: ## Build a Pages-ready docs/ directory
	npm run build

data: ## Regenerate static data artifacts
	go run ./cmd/build-data --output docs/data/v1

test: ## Run unit tests
	npm test
	go test $(GO_PACKAGES)

test-integration: ## Integration test placeholder for future data importers
	@echo "No integration suite is required for Mode B v1."

smoke: ## Build, serve docs like Pages, and run Playwright smoke tests
	./scripts/smoke.sh

lint: ## Run all linters and static checks
	npm run lint
	npm run fmt:check
	npm run typecheck
	goimports -w cmd internal
	go vet $(GO_PACKAGES)
	golangci-lint run $(GO_PACKAGES)

fmt: ## Autoformat source
	npm run fmt
	gofmt -w cmd internal
	goimports -w cmd internal

pages-preview: ## Serve docs/ locally under the GitHub Pages base path
	./scripts/pages-preview.sh

security: ## Run dependency and secret checks
	npm audit --audit-level=high
	govulncheck $(GO_PACKAGES)
	gitleaks detect --source . --no-git

docker-build: ## Mode B has no Docker image
	@echo "Skipped: Mode B deploys only to GitHub Pages."

docker-push: ## Mode B has no Docker image
	@echo "Skipped: Mode B deploys only to GitHub Pages."

release: build test smoke ## Tag a semver release after local checks
	rm -rf dist-data
	mkdir -p dist-data
	(cd docs && zip -qr ../dist-data/complete-gardener-planner-data-v$(VERSION).zip data/v1)
	git tag v$(VERSION)
	git push origin v$(VERSION)
	gh release create v$(VERSION) dist-data/complete-gardener-planner-data-v$(VERSION).zip --title v$(VERSION) --notes "Static Mode B release with generated garden planning data artifacts."

compose-up: ## Mode B has no compose stack
	@echo "Skipped: Mode B deploys only to GitHub Pages."

compose-down: ## Mode B has no compose stack
	@echo "Skipped: Mode B deploys only to GitHub Pages."

clean: ## Remove local build scratch directories
	rm -rf tmp coverage dist dist-data

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	.githooks/commit-msg .git/COMMIT_EDITMSG

hooks-pre-push:
	.githooks/pre-push

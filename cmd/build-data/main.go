// Package main builds static garden planning artifacts for GitHub Pages.
package main

import (
	"flag"
	"os"
	"os/exec"
	"strings"

	"github.com/baditaflorin/complete-gardener-planner/internal/utils"
)

func main() {
	output := flag.String("output", "docs/data/v1", "directory for generated static artifacts")
	sourceCommit := flag.String("source_commit", "", "source commit included in artifact metadata")
	reuseMetadata := flag.Bool("reuse_metadata", false, "reuse existing generated_at and source_commit metadata when present")
	_ = flag.String("start", "", "optional batch start cursor reserved for future data jobs")
	_ = flag.String("end", "", "optional batch end cursor reserved for future data jobs")
	_ = flag.Int("concurrency", 1, "optional concurrency reserved for future data jobs")
	_ = flag.Int("saveEvery", 100, "optional checkpoint cadence reserved for future data jobs")
	flag.Parse()

	commit := strings.TrimSpace(*sourceCommit)
	if commit == "" {
		commit = currentCommit(*output, *reuseMetadata)
	}

	generatedAt := existingGeneratedAt(*output, *reuseMetadata)
	err := writeArtifacts(*output, commit, generatedAt, buildArtifacts())
	utils.HandleErrorOrLogWithMessages(err, "data generation failed", "data generation complete")
	if err != nil {
		paniclessExit()
	}
}

func currentCommit(output string, reuseMetadata bool) string {
	if reuseMetadata {
		if meta, err := readExistingMetadata(output); err == nil && meta.SourceCommit != "" {
			return meta.SourceCommit
		}
	}
	out, err := exec.Command("git", "rev-parse", "--short", "HEAD").Output()
	if err != nil {
		return "unknown"
	}
	return strings.TrimSpace(string(out))
}

func existingGeneratedAt(output string, reuseMetadata bool) string {
	if !reuseMetadata {
		return ""
	}
	meta, err := readExistingMetadata(output)
	if err != nil {
		return ""
	}
	return meta.GeneratedAt
}

func paniclessExit() {
	os.Exit(1)
}

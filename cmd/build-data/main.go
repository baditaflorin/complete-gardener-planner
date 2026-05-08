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
	_ = flag.String("start", "", "optional batch start cursor reserved for future data jobs")
	_ = flag.String("end", "", "optional batch end cursor reserved for future data jobs")
	_ = flag.Int("concurrency", 1, "optional concurrency reserved for future data jobs")
	_ = flag.Int("saveEvery", 100, "optional checkpoint cadence reserved for future data jobs")
	flag.Parse()

	commit := strings.TrimSpace(*sourceCommit)
	if commit == "" {
		commit = currentCommit()
	}

	err := writeArtifacts(*output, commit, buildArtifacts())
	utils.HandleErrorOrLogWithMessages(err, "data generation failed", "data generation complete")
	if err != nil {
		paniclessExit()
	}
}

func currentCommit() string {
	out, err := exec.Command("git", "rev-parse", "--short", "HEAD").Output()
	if err != nil {
		return "unknown"
	}
	return strings.TrimSpace(string(out))
}

func paniclessExit() {
	os.Exit(1)
}

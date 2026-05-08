package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestWriteArtifactsCreatesDataAndMetadata(t *testing.T) {
	dir := filepath.Join(t.TempDir(), "v1")
	artifacts := []Artifact{
		{Name: "sample.json", Schema: "sample.v1", RecordCount: 1, Data: []map[string]string{{"id": "a"}}},
	}

	if err := writeArtifacts(dir, "abc123", artifacts); err != nil {
		t.Fatalf("writeArtifacts() error = %v", err)
	}

	for _, name := range []string{"sample.json", "sample.meta.json"} {
		if _, err := os.Stat(filepath.Join(dir, name)); err != nil {
			t.Fatalf("expected %s to exist: %v", name, err)
		}
	}
}

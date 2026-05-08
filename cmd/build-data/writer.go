// Package main builds static garden planning artifacts for GitHub Pages.
package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func writeArtifacts(output, sourceCommit string, artifacts []Artifact) error {
	parent := filepath.Dir(output)
	if err := os.MkdirAll(parent, 0o750); err != nil {
		return fmt.Errorf("create output parent: %w", err)
	}
	tmp, err := os.MkdirTemp(parent, ".data-v1-*")
	if err != nil {
		return fmt.Errorf("create temp dir: %w", err)
	}
	defer func() {
		if removeErr := os.RemoveAll(tmp); removeErr != nil {
			fmt.Fprintf(os.Stderr, "cleanup temp dir: %v\n", removeErr)
		}
	}()

	generatedAt := time.Now().UTC().Format(time.RFC3339)
	summary := make(map[string]int, len(artifacts))

	for _, artifact := range artifacts {
		payload, err := marshalStable(artifact.Data)
		if err != nil {
			return fmt.Errorf("marshal %s: %w", artifact.Name, err)
		}
		if err := os.WriteFile(filepath.Join(tmp, artifact.Name), payload, 0o600); err != nil {
			return fmt.Errorf("write %s: %w", artifact.Name, err)
		}
		meta := Metadata{
			GeneratedAt:   generatedAt,
			SourceCommit:  sourceCommit,
			SchemaVersion: artifact.Schema,
			RecordCount:   artifact.RecordCount,
			InputChecksums: map[string]string{
				strings.TrimSuffix(artifact.Name, ".json"): sha256Hex(payload),
			},
		}
		metaPayload, err := marshalStable(meta)
		if err != nil {
			return fmt.Errorf("marshal metadata for %s: %w", artifact.Name, err)
		}
		metaName := strings.TrimSuffix(artifact.Name, ".json") + ".meta.json"
		if err := os.WriteFile(filepath.Join(tmp, metaName), metaPayload, 0o600); err != nil {
			return fmt.Errorf("write %s: %w", metaName, err)
		}
		summary[artifact.Name] = artifact.RecordCount
	}

	if err := os.RemoveAll(output); err != nil {
		return fmt.Errorf("remove previous output: %w", err)
	}
	if err := os.Rename(tmp, output); err != nil {
		return fmt.Errorf("publish output: %w", err)
	}

	result, err := marshalStable(map[string]any{
		"output":       output,
		"sourceCommit": sourceCommit,
		"artifacts":    summary,
	})
	if err != nil {
		return fmt.Errorf("marshal summary: %w", err)
	}
	fmt.Println(string(result))
	return nil
}

func marshalStable(value any) ([]byte, error) {
	payload, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return nil, err
	}
	return append(payload, '\n'), nil
}

func sha256Hex(payload []byte) string {
	sum := sha256.Sum256(payload)
	return hex.EncodeToString(sum[:])
}

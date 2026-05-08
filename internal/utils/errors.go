package utils

import (
	"fmt"
	"log"
)

// HandleErrorOrLogWithMessages is the command-edge helper requested by the project bootstrap.
func HandleErrorOrLogWithMessages(err error, errMsg, successMsg string) {
	if err != nil {
		log.Printf("%s: %v", errMsg, err)
		return
	}
	if successMsg != "" {
		log.Print(successMsg)
	}
}

func Wrap(err error, message string) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("%s: %w", message, err)
}

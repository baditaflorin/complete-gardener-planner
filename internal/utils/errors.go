// Package utils contains small shared command helpers.
package utils

import "log"

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

package realtime

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// POST /api/realtime/session
type SessionReq struct {
	Model        string `json:"model"`
	Voice        string `json:"voice"`
	Instructions string `json:"instructions"`
}

type SessionResp struct {
	EphemeralKey string `json:"ephemeral_key"`
	SessionID    string `json:"session_id"`
}

func CreateRealtimeSession(c *gin.Context) {
	var req SessionReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "bad request"})
		return
	}
	if req.Model == "" {
		req.Model = "gpt-4o-realtime-preview"
	}

	payload := map[string]any{
		"model": req.Model,
		"voice": req.Voice,
	}
	if req.Instructions != "" {
		payload["instructions"] = req.Instructions
	}

	b, _ := json.Marshal(payload)
	httpReq, _ := http.NewRequest("POST", "https://api.openai.com/v1/realtime/sessions", bytes.NewReader(b))
	httpReq.Header.Set("Authorization", "Bearer "+os.Getenv("OPENAI_API_KEY"))
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		c.JSON(502, gin.H{"error": "upstream"})
		return
	}
	defer resp.Body.Close()
	var raw map[string]any
	json.NewDecoder(resp.Body).Decode(&raw)

	// extract id + client_secret.value
	cs := raw["client_secret"].(map[string]any)
	c.JSON(200, SessionResp{
		EphemeralKey: cs["value"].(string),
		SessionID:    (raw["id"]).(string),
	})
}

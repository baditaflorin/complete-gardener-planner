// Package main builds static garden planning artifacts for GitHub Pages.
package main

type Plant struct {
	ID                string   `json:"id"`
	CommonName        string   `json:"common_name"`
	ScientificName    string   `json:"scientific_name"`
	Family            string   `json:"family"`
	Guild             string   `json:"guild"`
	USDAZones         []int    `json:"usda_zones"`
	EUHardiness       string   `json:"eu_hardiness"`
	DaysToHarvest     int      `json:"days_to_harvest"`
	WaterMMPerWeek    float64  `json:"water_mm_per_week"`
	SunHoursMin       float64  `json:"sun_hours_min"`
	SunHoursMax       float64  `json:"sun_hours_max"`
	RotationGroup     string   `json:"rotation_group"`
	SoilPHMin         float64  `json:"soil_ph_min"`
	SoilPHMax         float64  `json:"soil_ph_max"`
	PlantingMonths    []string `json:"planting_months"`
	HarvestMonths     []string `json:"harvest_months"`
	DiseaseRisks      []string `json:"disease_risks"`
	CompanionBoostIDs []string `json:"companion_boost_ids"`
}

type CompanionEdge struct {
	SourceID string  `json:"source_id"`
	TargetID string  `json:"target_id"`
	Kind     string  `json:"kind"`
	Reason   string  `json:"reason"`
	Weight   float64 `json:"weight"`
}

type FrostStatistic struct {
	ZoneID           string  `json:"zone_id"`
	Label            string  `json:"label"`
	Latitude         float64 `json:"latitude"`
	Longitude        float64 `json:"longitude"`
	LastSpringFrost  string  `json:"last_spring_frost"`
	FirstAutumnFrost string  `json:"first_autumn_frost"`
	GrowingDays      int     `json:"growing_days"`
	Confidence       float64 `json:"confidence"`
}

type SoilCell struct {
	ID              string  `json:"id"`
	Label           string  `json:"label"`
	Latitude        float64 `json:"latitude"`
	Longitude       float64 `json:"longitude"`
	Texture         string  `json:"texture"`
	OrganicMatterPC float64 `json:"organic_matter_pc"`
	PH              float64 `json:"ph"`
	Drainage        string  `json:"drainage"`
	WaterHoldingMM  float64 `json:"water_holding_mm"`
	Source          string  `json:"source"`
}

type WeatherNormal struct {
	ZoneID        string    `json:"zone_id"`
	Label         string    `json:"label"`
	MonthlyRainMM []float64 `json:"monthly_rain_mm"`
	MonthlyET0MM  []float64 `json:"monthly_et0_mm"`
	MonthlyTempC  []float64 `json:"monthly_temp_c"`
	CachePolicy   string    `json:"cache_policy"`
	SourceSummary string    `json:"source_summary"`
}

type DiseaseSignature struct {
	ID              string   `json:"id"`
	Label           string   `json:"label"`
	AffectedPlants  []string `json:"affected_plants"`
	VisualCues      []string `json:"visual_cues"`
	SeverityDefault string   `json:"severity_default"`
	OrganicActions  []string `json:"organic_actions"`
}

type YieldModel struct {
	SchemaVersion string             `json:"schema_version"`
	ModelKind     string             `json:"model_kind"`
	Features      []string           `json:"features"`
	Coefficients  map[string]float64 `json:"coefficients"`
	Intercept     float64            `json:"intercept"`
	MAEPercent    float64            `json:"mae_percent"`
	TrainingRows  int                `json:"training_rows"`
	Notes         string             `json:"notes"`
}

type Metadata struct {
	GeneratedAt    string            `json:"generated_at"`
	SourceCommit   string            `json:"source_commit"`
	SchemaVersion  string            `json:"schema_version"`
	RecordCount    int               `json:"record_count"`
	InputChecksums map[string]string `json:"input_checksums"`
}

type Artifact struct {
	Name        string
	Schema      string
	RecordCount int
	Data        any
}

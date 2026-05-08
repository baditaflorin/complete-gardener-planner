package main

func buildArtifacts() []Artifact {
	plants := []Plant{
		{
			ID: "tomato", CommonName: "Tomato", ScientificName: "Solanum lycopersicum", Family: "Solanaceae",
			Guild: "fruiting annual", USDAZones: []int{3, 4, 5, 6, 7, 8, 9, 10}, EUHardiness: "H3-H5",
			DaysToHarvest: 78, WaterMMPerWeek: 34, SunHoursMin: 7, SunHoursMax: 10, RotationGroup: "nightshade",
			SoilPHMin: 6.0, SoilPHMax: 6.8, PlantingMonths: []string{"Mar", "Apr", "May"}, HarvestMonths: []string{"Jul", "Aug", "Sep"},
			DiseaseRisks: []string{"early-blight", "powdery-mildew"}, CompanionBoostIDs: []string{"basil", "marigold"},
		},
		{
			ID: "basil", CommonName: "Basil", ScientificName: "Ocimum basilicum", Family: "Lamiaceae",
			Guild: "herb", USDAZones: []int{4, 5, 6, 7, 8, 9, 10}, EUHardiness: "H3",
			DaysToHarvest: 45, WaterMMPerWeek: 25, SunHoursMin: 6, SunHoursMax: 9, RotationGroup: "leafy",
			SoilPHMin: 6.0, SoilPHMax: 7.5, PlantingMonths: []string{"Apr", "May", "Jun"}, HarvestMonths: []string{"Jun", "Jul", "Aug", "Sep"},
			DiseaseRisks: []string{"downy-mildew"}, CompanionBoostIDs: []string{"tomato", "pepper"},
		},
		{
			ID: "lettuce", CommonName: "Lettuce", ScientificName: "Lactuca sativa", Family: "Asteraceae",
			Guild: "leafy annual", USDAZones: []int{2, 3, 4, 5, 6, 7, 8, 9}, EUHardiness: "H4-H6",
			DaysToHarvest: 35, WaterMMPerWeek: 22, SunHoursMin: 4, SunHoursMax: 7, RotationGroup: "leafy",
			SoilPHMin: 6.0, SoilPHMax: 7.0, PlantingMonths: []string{"Mar", "Apr", "Sep"}, HarvestMonths: []string{"Apr", "May", "Oct"},
			DiseaseRisks: []string{"downy-mildew", "aphid-pressure"}, CompanionBoostIDs: []string{"carrot", "radish"},
		},
		{
			ID: "carrot", CommonName: "Carrot", ScientificName: "Daucus carota subsp. sativus", Family: "Apiaceae",
			Guild: "root crop", USDAZones: []int{3, 4, 5, 6, 7, 8, 9}, EUHardiness: "H4-H6",
			DaysToHarvest: 70, WaterMMPerWeek: 24, SunHoursMin: 6, SunHoursMax: 9, RotationGroup: "root",
			SoilPHMin: 6.0, SoilPHMax: 6.8, PlantingMonths: []string{"Mar", "Apr", "Aug"}, HarvestMonths: []string{"Jun", "Jul", "Oct"},
			DiseaseRisks: []string{"leaf-blight"}, CompanionBoostIDs: []string{"lettuce", "onion"},
		},
		{
			ID: "bean", CommonName: "Bush Bean", ScientificName: "Phaseolus vulgaris", Family: "Fabaceae",
			Guild: "legume", USDAZones: []int{3, 4, 5, 6, 7, 8, 9, 10}, EUHardiness: "H3-H5",
			DaysToHarvest: 55, WaterMMPerWeek: 26, SunHoursMin: 6, SunHoursMax: 9, RotationGroup: "legume",
			SoilPHMin: 6.0, SoilPHMax: 7.0, PlantingMonths: []string{"May", "Jun", "Jul"}, HarvestMonths: []string{"Jul", "Aug", "Sep"},
			DiseaseRisks: []string{"rust", "powdery-mildew"}, CompanionBoostIDs: []string{"corn", "cucumber"},
		},
		{
			ID: "marigold", CommonName: "Marigold", ScientificName: "Tagetes patula", Family: "Asteraceae",
			Guild: "beneficial flower", USDAZones: []int{2, 3, 4, 5, 6, 7, 8, 9, 10}, EUHardiness: "H3-H5",
			DaysToHarvest: 60, WaterMMPerWeek: 18, SunHoursMin: 6, SunHoursMax: 10, RotationGroup: "flower",
			SoilPHMin: 6.0, SoilPHMax: 7.5, PlantingMonths: []string{"Apr", "May", "Jun"}, HarvestMonths: []string{"Jun", "Jul", "Aug", "Sep"},
			DiseaseRisks: []string{"botrytis"}, CompanionBoostIDs: []string{"tomato", "pepper", "lettuce"},
		},
		{
			ID: "pepper", CommonName: "Pepper", ScientificName: "Capsicum annuum", Family: "Solanaceae",
			Guild: "fruiting annual", USDAZones: []int{4, 5, 6, 7, 8, 9, 10}, EUHardiness: "H3-H5",
			DaysToHarvest: 75, WaterMMPerWeek: 30, SunHoursMin: 7, SunHoursMax: 10, RotationGroup: "nightshade",
			SoilPHMin: 6.0, SoilPHMax: 6.8, PlantingMonths: []string{"Apr", "May"}, HarvestMonths: []string{"Jul", "Aug", "Sep"},
			DiseaseRisks: []string{"bacterial-spot", "powdery-mildew"}, CompanionBoostIDs: []string{"basil", "marigold"},
		},
		{
			ID: "cucumber", CommonName: "Cucumber", ScientificName: "Cucumis sativus", Family: "Cucurbitaceae",
			Guild: "vining annual", USDAZones: []int{4, 5, 6, 7, 8, 9, 10}, EUHardiness: "H3-H5",
			DaysToHarvest: 58, WaterMMPerWeek: 36, SunHoursMin: 7, SunHoursMax: 10, RotationGroup: "cucurbit",
			SoilPHMin: 6.0, SoilPHMax: 7.0, PlantingMonths: []string{"May", "Jun"}, HarvestMonths: []string{"Jul", "Aug", "Sep"},
			DiseaseRisks: []string{"powdery-mildew", "downy-mildew"}, CompanionBoostIDs: []string{"bean", "radish"},
		},
	}

	companions := []CompanionEdge{
		{SourceID: "tomato", TargetID: "basil", Kind: "beneficial", Reason: "Shared irrigation and aromatic pest confusion.", Weight: 0.86},
		{SourceID: "tomato", TargetID: "marigold", Kind: "beneficial", Reason: "Flower strip improves beneficial insect traffic.", Weight: 0.74},
		{SourceID: "lettuce", TargetID: "carrot", Kind: "beneficial", Reason: "Different rooting depth and compatible cool-season timing.", Weight: 0.71},
		{SourceID: "bean", TargetID: "cucumber", Kind: "beneficial", Reason: "Legume follows heavy feeder and shares warm-season bed timing.", Weight: 0.68},
		{SourceID: "tomato", TargetID: "pepper", Kind: "avoid", Reason: "Same nightshade rotation group and overlapping disease pressure.", Weight: -0.82},
		{SourceID: "cucumber", TargetID: "lettuce", Kind: "caution", Reason: "Cucumber canopy can shade lettuce unless trellised north of the row.", Weight: -0.31},
	}

	frost := []FrostStatistic{
		{ZoneID: "us-7a", Label: "US Zone 7a urban edge", Latitude: 38.91, Longitude: -77.04, LastSpringFrost: "2026-04-08", FirstAutumnFrost: "2026-10-28", GrowingDays: 203, Confidence: 0.78},
		{ZoneID: "eu-6b", Label: "EU continental 6b", Latitude: 45.76, Longitude: 21.23, LastSpringFrost: "2026-04-16", FirstAutumnFrost: "2026-10-18", GrowingDays: 185, Confidence: 0.74},
		{ZoneID: "balcony-9b", Label: "Mild balcony microclimate 9b", Latitude: 41.39, Longitude: 2.17, LastSpringFrost: "2026-02-22", FirstAutumnFrost: "2026-12-08", GrowingDays: 290, Confidence: 0.69},
	}

	soil := []SoilCell{
		{ID: "loam-urban-001", Label: "Raised bed loam", Latitude: 44.43, Longitude: 26.10, Texture: "loam", OrganicMatterPC: 5.8, PH: 6.6, Drainage: "balanced", WaterHoldingMM: 42, Source: "demo raster cell normalized from static fixture"},
		{ID: "clay-urban-002", Label: "Compacted urban clay", Latitude: 45.76, Longitude: 21.23, Texture: "clay loam", OrganicMatterPC: 3.1, PH: 7.4, Drainage: "slow", WaterHoldingMM: 56, Source: "demo raster cell normalized from static fixture"},
		{ID: "sandy-balcony-003", Label: "Container sandy mix", Latitude: 41.39, Longitude: 2.17, Texture: "sandy loam", OrganicMatterPC: 4.4, PH: 6.2, Drainage: "fast", WaterHoldingMM: 26, Source: "demo raster cell normalized from static fixture"},
	}

	weather := []WeatherNormal{
		{ZoneID: "us-7a", Label: "US Zone 7a urban edge", MonthlyRainMM: []float64{72, 66, 84, 78, 93, 88, 95, 82, 78, 71, 69, 74}, MonthlyET0MM: []float64{24, 31, 55, 78, 104, 126, 139, 118, 85, 58, 34, 25}, MonthlyTempC: []float64{2.1, 4.0, 8.8, 14.2, 19.5, 24.0, 26.8, 25.9, 21.7, 15.4, 9.2, 4.1}, CachePolicy: "offline static normal, refresh yearly", SourceSummary: "demo normal shaped after public climate-normal fields"},
		{ZoneID: "eu-6b", Label: "EU continental 6b", MonthlyRainMM: []float64{44, 39, 48, 58, 69, 76, 62, 54, 48, 42, 45, 49}, MonthlyET0MM: []float64{16, 24, 48, 75, 102, 129, 143, 126, 82, 47, 24, 15}, MonthlyTempC: []float64{-1.0, 1.8, 7.4, 12.9, 18.0, 21.7, 23.9, 23.2, 18.7, 12.5, 6.2, 1.1}, CachePolicy: "offline static normal, refresh yearly", SourceSummary: "demo normal shaped after public climate-normal fields"},
		{ZoneID: "balcony-9b", Label: "Mild balcony microclimate 9b", MonthlyRainMM: []float64{43, 36, 42, 49, 55, 31, 22, 35, 62, 81, 64, 48}, MonthlyET0MM: []float64{31, 42, 69, 94, 123, 151, 166, 145, 103, 70, 43, 32}, MonthlyTempC: []float64{9.6, 10.4, 12.8, 15.1, 19.0, 23.3, 26.1, 26.4, 23.2, 18.6, 13.4, 10.3}, CachePolicy: "offline static normal, refresh yearly", SourceSummary: "demo normal shaped after public climate-normal fields"},
	}

	diseases := []DiseaseSignature{
		{ID: "powdery-mildew", Label: "Powdery mildew", AffectedPlants: []string{"tomato", "bean", "cucumber", "pepper"}, VisualCues: []string{"white powder patches", "leaf curl", "humid nights"}, SeverityDefault: "medium", OrganicActions: []string{"Prune for airflow", "Water at soil level", "Remove heavily infected leaves"}},
		{ID: "early-blight", Label: "Early blight", AffectedPlants: []string{"tomato"}, VisualCues: []string{"concentric brown leaf spots", "yellow halo", "lower leaves first"}, SeverityDefault: "medium", OrganicActions: []string{"Mulch soil splash zone", "Rotate nightshades for 3 years", "Remove infected foliage"}},
		{ID: "downy-mildew", Label: "Downy mildew", AffectedPlants: []string{"basil", "lettuce", "cucumber"}, VisualCues: []string{"angular yellow lesions", "gray underside fuzz", "cool wet weather"}, SeverityDefault: "high", OrganicActions: []string{"Increase spacing", "Avoid overhead watering", "Remove infected plants promptly"}},
		{ID: "rust", Label: "Bean rust", AffectedPlants: []string{"bean"}, VisualCues: []string{"orange pustules", "speckled leaves", "late-season humidity"}, SeverityDefault: "low", OrganicActions: []string{"Destroy crop residue", "Use drip irrigation", "Plant resistant varieties"}},
	}

	yieldModel := YieldModel{
		SchemaVersion: "1.0.0",
		ModelKind:     "linear-regression-demo",
		Features:      []string{"sun_hours", "water_balance_mm", "soil_organic_matter_pc", "days_in_ground", "disease_pressure"},
		Coefficients: map[string]float64{
			"sun_hours":              0.082,
			"water_balance_mm":       0.018,
			"soil_organic_matter_pc": 0.065,
			"days_in_ground":         0.011,
			"disease_pressure":       -0.14,
		},
		Intercept:    0.62,
		MAEPercent:   13.8,
		TrainingRows: 72,
		Notes:        "Demo coefficients mirror the Polars/scikit-learn workflow in ml/train_yield_model.py.",
	}

	return []Artifact{
		{Name: "plants.json", Schema: "plants.v1", RecordCount: len(plants), Data: plants},
		{Name: "companions.json", Schema: "companions.v1", RecordCount: len(companions), Data: companions},
		{Name: "frost.json", Schema: "frost.v1", RecordCount: len(frost), Data: frost},
		{Name: "soil-cells.json", Schema: "soil-cells.v1", RecordCount: len(soil), Data: soil},
		{Name: "weather-normals.json", Schema: "weather-normals.v1", RecordCount: len(weather), Data: weather},
		{Name: "disease-signatures.json", Schema: "disease-signatures.v1", RecordCount: len(diseases), Data: diseases},
		{Name: "yield-model.json", Schema: "yield-model.v1", RecordCount: 1, Data: yieldModel},
	}
}

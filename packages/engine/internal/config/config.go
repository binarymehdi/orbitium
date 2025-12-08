package config

import (
	"os"

	"pipeline-engine/internal/types"

	"gopkg.in/yaml.v3"
)

func Load(path string) (types.Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return types.Config{}, err
	}

	var config types.Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return types.Config{}, err
	}

	return config, nil
}

package types

type Config struct {
	Languages map[string]string `yaml:"languages"`
}

type Pipeline struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
}

type Node struct {
	ID   string   `json:"id"`
	Type string   `json:"type"`
	Data NodeData `json:"data"`
}

type NodeData struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Executable  Executable `json:"executable"`
}

type Executable struct {
	Language string `json:"language"`
	Code     string `json:"code"`
}

type Edge struct {
	ID     string `json:"id"`
	Source string `json:"source"`
	Target string `json:"target"`
}

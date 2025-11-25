# Figures and Tables Guide for Orbitium Report

This document lists all figures and tables referenced in the report. Create these visual assets and add them to your LaTeX document.

## FIGURES TO CREATE

### Figure 1: System Architecture
**Label:** `fig:system_architecture`
**Referenced in:** Introduction
**Description:** Overall system architecture showing the three main components:
- Frontend (React + React Flow)
- Backend (FastAPI)
- Database (PostgreSQL)
- Show connections between components with arrows
- Include Docker containers around each component

**Suggested Tool:** Draw.io, Lucidchart, or PowerPoint
**Content:**
```
┌─────────────────────────────────────────────┐
│         Frontend (React + TypeScript)       │
│  ┌────────────────────────────────────┐    │
│  │     React Flow Visualization        │    │
│  │  Zustand State Management           │    │
│  │  TanStack Router & Query            │    │
│  │  Monaco Editor                      │    │
│  └────────────────────────────────────┘    │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST API
┌──────────────────▼──────────────────────────┐
│        Backend (FastAPI + Python)           │
│  ┌────────────────────────────────────┐    │
│  │   API Endpoints (v1/flows)          │    │
│  │   SQLModel ORM                      │    │
│  │   Pydantic Validation               │    │
│  └────────────────────────────────────┘    │
└──────────────────┬──────────────────────────┘
                   │ PostgreSQL Connection
┌──────────────────▼──────────────────────────┐
│        Database (PostgreSQL 17)             │
│  ┌────────────────────────────────────┐    │
│  │   Flow Table (JSONB)                │    │
│  │   Workflow Metadata                 │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

### Figure 2: Three-Tier Architecture
**Label:** `fig:three_tier_arch`
**Referenced in:** Methodology Section
**Description:** Detailed three-tier architecture diagram
- Presentation Layer (React components, UI)
- Application Layer (FastAPI, Business Logic)
- Data Layer (PostgreSQL, Persistence)

---

### Figure 3: DAG Representation
**Label:** `fig:dag_representation`
**Referenced in:** Methodology Section
**Description:** Example of a workflow represented as a Directed Acyclic Graph
- Show 4-5 nodes (circles) with labels (e.g., "Load Data", "Process", "Analyze", "Visualize")
- Directed edges (arrows) showing dependencies
- Highlight that there are NO cycles
- Label nodes as v1, v2, v3, etc.
- Label edges as (v1→v2), (v2→v3), etc.

**Example:**
```
    [Start]
       │
       ▼
  [Load Data (Python)]
       │
       ▼
  [Clean Data (Python)]
       │
       ▼
  [Analysis (Python)]
       │
       ▼
     [End]
```

---

### Figure 4: Dagre Layout Process
**Label:** `fig:dagre_layout`
**Referenced in:** Methodology Section
**Description:** Four phases of Dagre layout algorithm
- Phase 1: Layer Assignment
- Phase 2: Crossing Reduction
- Phase 3: Coordinate Assignment
- Phase 4: Edge Routing
- Show before/after of a messy graph becoming organized

---

### Figure 5: State Flow Architecture
**Label:** `fig:state_flow`
**Referenced in:** Methodology Section
**Description:** Data flow diagram showing:
- User interactions → Actions
- Actions → Zustand Store
- Store → React Components
- Components → React Flow Visualization
- API calls → Backend
- Backend → Database
- Use arrows and boxes to show unidirectional data flow

---

### Figure 6: Node Design Components
**Label:** `fig:node_design`
**Referenced in:** Methodology Section
**Description:** Annotated screenshot or diagram of a task node showing:
- Language icon area (top left)
- Task title (bold)
- Node type badge (e.g., "Processing")
- Description text area
- Input handle (top)
- Output handle (bottom)
- Settings drawer button (top right)

**TIP:** Take a screenshot from your running application!

---

### Figure 7: Deployment Architecture
**Label:** `fig:deployment`
**Referenced in:** Methodology Section
**Description:** Docker Compose deployment showing:
- PostgreSQL container (port 5433)
- FastAPI backend container
- Vite frontend dev server
- Volume mounts
- Network connections

---

### Figure 8: Logic Model Framework
**Label:** `fig:logic_model`
**Referenced in:** Logic Model Section
**Description:** Flow diagram showing:
- Inputs (Resources) → Activities → Outputs → Outcomes (Short/Medium/Long-term) → Impact
- Fill in specific items from your logic model section

---

### Figure 9: Example Workflow
**Label:** `fig:example_workflow`
**Referenced in:** Results Section
**Description:** Screenshot of your temperature data analysis workflow
- Show the actual workflow in the playground view
- Include all 4 nodes: Load Data → Clean & Validate → Statistical Analysis → Generate Visualization
- Capture the visual layout with connections

**TIP:** Take this screenshot directly from your application!

---

## TABLES TO CREATE

### Table 1: Technology Stack Summary
**Label:** `tab:tech_stack`
**Referenced in:** Project Specifications
**Content:**
```latex
\begin{table}[h]
\centering
\caption{Complete Technology Stack}
\label{tab:tech_stack}
\begin{tabular}{|l|l|l|}
\hline
\textbf{Layer} & \textbf{Technology} & \textbf{Version} \\
\hline
Frontend Framework & React & 19.1.1 \\
Type System & TypeScript & Latest \\
Build Tool & Vite & 4.x \\
Workflow Visualization & React Flow (@xyflow/react) & 12.8.5 \\
State Management & Zustand & Latest \\
Routing & TanStack Router & 1.131.48 \\
Data Fetching & TanStack Query & 5.89.0 \\
Code Editor & Monaco Editor & 4.7.0 \\
UI Components & Radix UI & Latest \\
Graph Layout & Dagre & 1.1.5 \\
\hline
Backend Framework & FastAPI & 0.118+ \\
Language & Python & 3.13 \\
ORM & SQLModel & 0.0.27 \\
Validation & Pydantic & via FastAPI \\
Package Manager & UV & Latest \\
\hline
Database & PostgreSQL & 17-alpine \\
\hline
Containerization & Docker & Latest \\
Orchestration & Docker Compose & Latest \\
\hline
\end{tabular}
\end{table}
```

---

### Table 2: Engineering Standards Applied
**Label:** `tab:engineering_standards`
**Referenced in:** Engineering Standards
**Content:**
```latex
\begin{table}[h]
\centering
\caption{Engineering Standards Applied to Orbitium}
\label{tab:engineering_standards}
\begin{tabular}{|l|p{8cm}|}
\hline
\textbf{Standard} & \textbf{Application in Orbitium} \\
\hline
ISO/IEC 25010 & Quality model for maintainability and usability \\
REST API & Stateless HTTP-based API design \\
OpenAPI 3.0 & Automatic API documentation via FastAPI \\
Semantic Versioning & Dependency version management \\
W3C Web Standards & HTML5, CSS3, ARIA for accessibility \\
OCI & Docker image and runtime specifications \\
12-Factor App & Configuration, stateless processes \\
SQL:2016 & PostgreSQL database operations \\
OWASP Top 10 & Security best practices \\
TypeScript Strict & Type safety in frontend code \\
Python Type Hints & Type safety in backend code \\
\hline
\end{tabular}
\end{table}
```

---

### Table 3: API Endpoints
**Label:** `tab:api_endpoints`
**Referenced in:** Methodology Section
**Content:**
```latex
\begin{table}[h]
\centering
\caption{REST API Endpoints}
\label{tab:api_endpoints}
\begin{tabular}{|l|l|p{6cm}|}
\hline
\textbf{Method} & \textbf{Endpoint} & \textbf{Description} \\
\hline
GET & /api/v1/flows & Retrieve all workflows \\
GET & /api/v1/flows/\{id\} & Retrieve specific workflow by ID \\
POST & /api/v1/flows/create-flow & Create new workflow \\
PUT & /api/v1/flows/\{id\}/edit & Update existing workflow \\
DELETE & /api/v1/flows/\{id\} & Delete workflow \\
GET & /api/v1/flows/\{id\}/execute & Execute workflow (future) \\
GET & /api/v1/health-check & Health check endpoint \\
\hline
\end{tabular}
\end{table}
```

---

### Table 4: Performance Metrics
**Label:** `tab:performance`
**Referenced in:** Results Section
**Content:**
```latex
\begin{table}[h]
\centering
\caption{Workflow Performance Metrics}
\label{tab:performance}
\begin{tabular}{|l|r|r|}
\hline
\textbf{Workflow Size} & \textbf{Load Time (ms)} & \textbf{Render Time (ms)} \\
\hline
Small (5-10 nodes) & <50 & <50 \\
Medium (20-30 nodes) & 100-150 & 100-150 \\
Large (50+ nodes) & 200-300 & 200-300 \\
\hline
\multicolumn{3}{|l|}{\textbf{API Response Times}} \\
\hline
GET /flows (list) & 15-25 & N/A \\
POST /create-flow & 20-30 & N/A \\
PUT /\{id\}/edit & 25-35 & N/A \\
GET /\{id\} (single) & 10-20 & N/A \\
\hline
\end{tabular}
\end{table}
```

---

## ALGORITHM PSEUDOCODE

### Algorithm 1: Topological Sort
**Label:** `alg:topo_sort`
**Referenced in:** Methodology Section
**Content:**
```latex
\begin{algorithm}
\caption{Topological Sort using Depth-First Search}
\label{alg:topo_sort}
\begin{algorithmic}[1]
\Procedure{TopologicalSort}{$nodes, edges$}
    \State $visited \gets \emptyset$
    \State $order \gets []$
    
    \Procedure{DFS}{$node$}
        \If{$node \in visited$}
            \Return
        \EndIf
        \State $visited \gets visited \cup \{node\}$
        \For{each $edge$ where $edge.source = node$}
            \State \Call{DFS}{$edge.target$}
        \EndFor
        \State $order$.prepend($node$)
    \EndProcedure
    
    \For{each $node \in nodes$}
        \If{$node \notin visited$}
            \State \Call{DFS}{$node$}
        \EndIf
    \EndFor
    
    \State \Return $order$
\EndProcedure
\end{algorithmic}
\end{algorithm}
```

**Note:** You'll need to add `\usepackage{algorithm}` and `\usepackage{algpseudocode}` to your preamble.

---

## HOW TO ADD TO YOUR LaTeX DOCUMENT

1. **For Figures:**
   - Create the image file (PNG, PDF, or JPG)
   - Save it in a folder like `figures/` in your project
   - Add to LaTeX:
   ```latex
   \begin{figure}[h]
   \centering
   \includegraphics[width=0.8\textwidth]{figures/system_architecture.png}
   \caption{Overall System Architecture}
   \label{fig:system_architecture}
   \end{figure}
   ```

2. **For Tables:**
   - Copy the LaTeX code provided above
   - Place it in the appropriate section
   - Adjust column widths if needed

3. **For Screenshots:**
   - Run your application
   - Take high-quality screenshots (use Snipping Tool on Windows)
   - Save as PNG files
   - Add using the figure template above

## ADDITIONAL PACKAGES NEEDED

Add these to your preamble if not already present:

```latex
\usepackage{graphicx}  % For including images
\usepackage{algorithm}  % For algorithms
\usepackage{algpseudocode}  % For algorithm pseudocode
\usepackage{booktabs}  % For better tables
\usepackage{array}  % For advanced table features
```

## QUICK TIPS

1. **Screenshot Quality:** Use high DPI settings (at least 1920x1080) for screenshots
2. **Diagram Tools:** 
   - Draw.io (free, web-based)
   - Lucidchart (online)
   - Microsoft PowerPoint or Visio
   - TikZ (LaTeX native, but complex)
3. **File Formats:** PDF is best for diagrams, PNG for screenshots
4. **Placement:** Use `[h]` for "here", `[t]` for top, `[b]` for bottom, `[H]` for "exactly here" (requires `\usepackage{float}`)

---

## PRIORITY ORDER

**Must Have (Critical):**
1. Figure 1: System Architecture
2. Table 1: Technology Stack
3. Figure 9: Example Workflow (screenshot)
4. Table 3: API Endpoints

**Should Have (Important):**
5. Figure 3: DAG Representation
6. Figure 6: Node Design (screenshot)
7. Table 4: Performance Metrics
8. Table 2: Engineering Standards

**Nice to Have (Optional):**
9. Figure 2: Three-Tier Architecture
10. Figure 5: State Flow Architecture
11. Figure 4: Dagre Layout Process
12. Figure 7: Deployment Architecture
13. Figure 8: Logic Model Framework
14. Algorithm 1: Topological Sort

---

Good luck with creating your figures and tables! Focus on the "Must Have" items first, then add others as time permits.

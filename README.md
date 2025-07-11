# Professional Hierarchy Generator
[![Build](https://github.com/seemueller-io/sumpin/actions/workflows/ci.yml/badge.svg)](https://github.com/seemueller-io/sumpin/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Uses `@openai/agents` to graph hierarchal business relationships. 

## Features

- 🚀 **CLI Interface**: Professional command-line tool with comprehensive options
- 🧠 **AI-Powered**: Uses OpenAI to generate hierarchies from natural language
- 📊 **Multiple Formats**: Generate JSON data or executable TypeScript code
- 🏗️ **Flexible Structure**: Support for both v1 (4-layer) and v2 (6-layer) hierarchies
- ⚡ **Streaming Output**: Real-time generation feedback
- 🎯 **Complexity Levels**: Simple, medium, or complex hierarchy generation
- 📁 **Organized Output**: Automatic file naming and directory management

> See /output for example artifacts

## Quick Start

### Installation

```shell
# install bun: (curl -fsSL https://bun.sh/install | bash)
bun install
```

### Basic Usage

Generate a simple hierarchy:
```shell
bun run sumpin "Create a technology hierarchy for web development"
```

Generate TypeScript code with streaming:
```shell
bun run sumpin --format typescript --stream "Healthcare hierarchy for emergency medicine"
```

Generate both formats with custom complexity:
```shell
bun run sumpin --format both --complexity complex "Finance hierarchy for investment banking"
```

## CLI Reference

### Usage
```
bun run sumpin [OPTIONS] "<natural language specification>"
```

### Available Commands
- `bun run sumpin` - Main CLI command
- `bun run cli` - Alternative CLI alias
- `bun run generate` - Generation alias
- `bun run demo` - Run demonstration examples

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--help` | `-h` | Show help message | - |
| `--version` | `-v` | Show version | - |
| `--output DIR` | `-o` | Output directory | `./output` |
| `--format FORMAT` | `-f` | Output format: `json`, `typescript`, `both` | `json` |
| `--complexity LEVEL` | `-c` | Complexity: `simple`, `medium`, `complex` | `medium` |
| `--hierarchy-version VER` | | Version: `v1`, `v2` | `v2` |
| `--stream` | | Enable streaming output | `false` |
| `--quiet` | | Suppress progress messages | `false` |
| `--skills` | | Include skills and competencies | `true` |
| `--tools` | | Include tools and technologies | `true` |
| `--examples` | | Include practical examples | `true` |

### Examples

**Basic JSON Generation:**
```shell
bun run sumpin "Create a retail hierarchy for e-commerce"
```

**TypeScript with Custom Output:**
```shell
bun run sumpin -f typescript -o ./my-hierarchies "Education hierarchy for online learning"
```

**Complex v1 Hierarchy:**
```shell
bun run sumpin -c complex --hierarchy-version v1 "Manufacturing hierarchy for automotive"
```

**Both Formats, Quiet Mode:**
```shell
bun run sumpin --format both --quiet "Consulting hierarchy for management consulting"
```

## Hierarchy Versions

### v1 Structure (4-layer)
- Domain → Specialization → Role → Responsibility
- Simpler structure, ideal for basic organizational modeling

### v2 Structure (6-layer)
- Domain → Industry → Profession → Field → Role → Task
- Comprehensive structure with detailed professional modeling

## Output Formats

### JSON Format
- Clean, structured data
- Easy to integrate with other systems
- MobX State Tree compatible

### TypeScript Format
- Executable code with imports
- Demonstrates real-world usage
- Includes competencies, tools, and examples

## Development

### Run Demonstrations
```shell
bun run demo
```

### Run Tests
```shell
bun test
```

### Project Structure
```
├── cli.ts                 # Main CLI interface
├── generate-template.ts   # JSON hierarchy generation
├── index.ts              # Demonstration examples
├── lib/
│   ├── agent-wrapper.ts  # OpenAI agent integration
│   ├── hierarchy-model.ts # MobX State Tree models
│   ├── v1.ts             # v1 hierarchy models
│   ├── v2.ts             # v2 hierarchy models
│   └── components/       # Generation components
└── output/               # Generated hierarchies
```

## Requirements

- **Bun**: v1.1.36+ (JavaScript runtime)
- **OpenAI API Key**: Set `OPENAI_API_KEY` environment variable
- **TypeScript**: ^5.0.0 (peer dependency)

## Environment Setup

Create a `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```
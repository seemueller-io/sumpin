# Examples Directory

This directory contains comprehensive examples demonstrating how to use both versions of the professional hierarchy models.

## Structure

- `v1/` - Examples for the simpler 4-layer hierarchy model (Domain → Specialization → Role → Responsibility)
- `v2/` - Examples for the advanced 6-layer hierarchy model (Domain → Industry → Profession → Field → Role → Task)

## Prerequisites

Make sure you have the required dependencies installed:

```bash
bun install
```

For v1 and v2 examples, you'll also need:
```bash
bun add mobx-state-tree mobx uuid
bun add -d @types/uuid
```

## Running Examples

Each example can be run independently using Bun:

```bash
# Run v1 examples
bun run examples/v1/healthcare-example.ts
bun run examples/v1/technology-example.ts

# Run v2 examples  
bun run examples/v2/software-company-example.ts
bun run examples/v2/healthcare-system-example.ts
```

## Testing Examples

You can also run the test files to see the examples in action:

```bash
# Test v1 examples
bun test examples/v1/

# Test v2 examples
bun test examples/v2/
```

## Example Scenarios

### V1 Examples (4-layer hierarchy)
- **Healthcare Example**: Models medical professionals with specializations, roles, and responsibilities
- **Technology Example**: Models software engineering domain with various specializations

### V2 Examples (6-layer hierarchy)
- **Software Company Example**: Complete modeling of a tech company's professional structure
- **Healthcare System Example**: Comprehensive healthcare organization modeling

Each example demonstrates:
- Creating and structuring hierarchies
- Adding attributes/skills/tools
- CRUD operations
- Querying and traversing the hierarchy
- Real-world use cases and best practices
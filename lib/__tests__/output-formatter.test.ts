import { expect, test, describe, beforeEach } from "bun:test";
import { OutputFormatter } from "../components/output-formatter";
import type { OutputOptions, FormattedOutput } from "../components/output-formatter";

describe("OutputFormatter", () => {
  let formatter: OutputFormatter;
  const sampleContent = `const enterprise = Enterprise.create({});
const domain = DomainModel.create({
  name: "Technology",
  description: "Technology domain"
});
enterprise.addDomain(domain);`;

  beforeEach(() => {
    formatter = new OutputFormatter();
  });

  describe("formatOutput", () => {
    test("should format TypeScript output", () => {
      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      expect(result.extension).toBe('ts');
      expect(result.filename).toBe('technology-hierarchy-example');
      expect(result.content).toContain('import {');
      expect(result.content).toContain('DomainModel, SpecializationModel, RoleModel, ResponsibilityModel');
      expect(result.content).toContain('Technology Professional Hierarchy Example');
      expect(result.metadata?.domain).toBe('Technology');
      expect(result.metadata?.version).toBe('v1');
    });

    test("should format Markdown output", () => {
      const options: OutputOptions = {
        format: 'markdown',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Healthcare", "v2", options);

      expect(result.extension).toBe('md');
      expect(result.filename).toBe('healthcare-hierarchy-example');
      expect(result.content).toContain('# Healthcare Professional Hierarchy Example');
      expect(result.content).toContain('6-layer hierarchy');
      expect(result.content).toContain('Domain → Industry → Profession → Field → Role → Task');
      expect(result.content).toContain('```typescript');
      expect(result.metadata?.domain).toBe('Healthcare');
      expect(result.metadata?.version).toBe('v2');
    });

    test("should format JSON output", () => {
      const options: OutputOptions = {
        format: 'json',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Finance", "v1", options);

      expect(result.extension).toBe('json');
      expect(result.filename).toBe('finance-hierarchy-example');
      
      const parsed = JSON.parse(result.content);
      expect(parsed.domain).toBe('Finance');
      expect(parsed.version).toBe('v1');
      expect(parsed.structure).toEqual(['Domain', 'Specialization', 'Role', 'Responsibility']);
      expect(parsed.generatedContent).toBe(sampleContent);
      expect(parsed.metadata).toBeDefined();
    });

    test("should format YAML output", () => {
      const options: OutputOptions = {
        format: 'yaml',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Education", "v2", options);

      expect(result.extension).toBe('yaml');
      expect(result.filename).toBe('education-hierarchy-example');
      expect(result.content).toContain('domain: Education');
      expect(result.content).toContain('version: v2');
      expect(result.content).toContain('- Domain');
      expect(result.content).toContain('- Industry');
      expect(result.content).toContain('- Profession');
      expect(result.content).toContain('generated_content: |');
      expect(result.metadata?.domain).toBe('Education');
    });

    test("should throw error for unsupported format", () => {
      const options = {
        format: 'xml' as any,
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      expect(() => {
        formatter.formatOutput(sampleContent, "Technology", "v1", options);
      }).toThrow('Unsupported format: xml');
    });
  });

  describe("formatTypeScript", () => {
    test("should include comments when enabled", () => {
      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      expect(result.content).toContain('/**');
      expect(result.content).toContain('Technology Professional Hierarchy Example');
      expect(result.content).toContain('Model Version: v1');
      expect(result.content).toContain('4-layer hierarchy');
    });

    test("should exclude comments when disabled", () => {
      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: false
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      expect(result.content).not.toContain('/**');
      expect(result.content).not.toContain('Technology Professional Hierarchy Example');
      expect(result.content).toContain('import {');
    });

    test("should include timestamp when enabled", () => {
      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: true,
        includeTimestamp: true,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      expect(result.content).toContain('Generated on:');
      expect(result.metadata?.generatedAt).toBeDefined();
    });

    test("should use correct imports for v1", () => {
      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: false
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      expect(result.content).toContain('DomainModel, SpecializationModel, RoleModel, ResponsibilityModel');
      expect(result.content).toContain('from "../../lib/v1"');
    });

    test("should use correct imports for v2", () => {
      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: false
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v2", options);

      expect(result.content).toContain('DomainModel, IndustryModel, ProfessionModel, FieldModel, RoleModel, TaskModel');
      expect(result.content).toContain('from "../../lib/v2"');
    });
  });

  describe("extractTypeScriptCode", () => {
    test("should extract code from markdown code blocks", () => {
      const markdownContent = `# Some Title

Here's the TypeScript code:

\`\`\`typescript
const example = "test";
console.log(example);
\`\`\`

Some other text.`;

      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: false,
        includeTimestamp: false,
        includeComments: false
      };

      const result = formatter.formatOutput(markdownContent, "Test", "v1", options);

      expect(result.content).toContain('const example = "test";');
      expect(result.content).toContain('console.log(example);');
      expect(result.content).not.toContain('# Some Title');
    });

    test("should handle content without code blocks", () => {
      const plainContent = `const test = "value";
function example() {
  return test;
}`;

      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: false,
        includeTimestamp: false,
        includeComments: false
      };

      const result = formatter.formatOutput(plainContent, "Test", "v1", options);

      expect(result.content).toContain('const test = "value";');
      expect(result.content).toContain('function example()');
    });

    test("should filter out markdown formatting", () => {
      const mixedContent = `# Title
**Bold text**
*Italic text*
- List item
const code = "actual code";`;

      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: false,
        includeTimestamp: false,
        includeComments: false
      };

      const result = formatter.formatOutput(mixedContent, "Test", "v1", options);

      expect(result.content).toContain('const code = "actual code";');
      expect(result.content).not.toContain('# Title');
      expect(result.content).not.toContain('**Bold text**');
      expect(result.content).not.toContain('- List item');
    });
  });

  describe("formatMarkdown", () => {
    test("should create proper markdown structure", () => {
      const options: OutputOptions = {
        format: 'markdown',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      expect(result.content).toContain('# Technology Professional Hierarchy Example');
      expect(result.content).toContain('## Overview');
      expect(result.content).toContain('## Structure');
      expect(result.content).toContain('## Generated Content');
      expect(result.content).toContain('## Usage');
      expect(result.content).toContain('4-layer hierarchy');
      expect(result.content).toContain('Domain → Specialization → Role → Responsibility');
    });

    test("should handle v2 structure correctly", () => {
      const options: OutputOptions = {
        format: 'markdown',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Healthcare", "v2", options);

      expect(result.content).toContain('6-layer hierarchy');
      expect(result.content).toContain('Domain → Industry → Profession → Field → Role → Task');
    });

    test("should include timestamp when enabled", () => {
      const options: OutputOptions = {
        format: 'markdown',
        includeMetadata: true,
        includeTimestamp: true,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      expect(result.content).toContain('**Generated on:**');
    });
  });

  describe("formatJSON", () => {
    test("should create valid JSON structure", () => {
      const options: OutputOptions = {
        format: 'json',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      const parsed = JSON.parse(result.content);
      expect(parsed.domain).toBe('Technology');
      expect(parsed.version).toBe('v1');
      expect(parsed.structure).toEqual(['Domain', 'Specialization', 'Role', 'Responsibility']);
      expect(parsed.generatedContent).toBe(sampleContent);
      expect(parsed.metadata).toBeDefined();
      expect(parsed.metadata.generator).toBe('OpenAI Agents SDK + Sumpin');
      expect(parsed.metadata.hierarchyType).toBe('4-layer hierarchy');
    });

    test("should handle v2 structure", () => {
      const options: OutputOptions = {
        format: 'json',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Healthcare", "v2", options);

      const parsed = JSON.parse(result.content);
      expect(parsed.version).toBe('v2');
      expect(parsed.structure).toEqual(['Domain', 'Industry', 'Profession', 'Field', 'Role', 'Task']);
      expect(parsed.metadata.hierarchyType).toBe('6-layer hierarchy');
    });

    test("should exclude metadata when disabled", () => {
      const options: OutputOptions = {
        format: 'json',
        includeMetadata: false,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      const parsed = JSON.parse(result.content);
      expect(parsed.metadata).toBeUndefined();
    });

    test("should include timestamp when enabled", () => {
      const options: OutputOptions = {
        format: 'json',
        includeMetadata: true,
        includeTimestamp: true,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      const parsed = JSON.parse(result.content);
      expect(parsed.metadata.generatedAt).toBeDefined();
    });
  });

  describe("formatYAML", () => {
    test("should create valid YAML structure", () => {
      const options: OutputOptions = {
        format: 'yaml',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      expect(result.content).toContain('domain: Technology');
      expect(result.content).toContain('version: v1');
      expect(result.content).toContain('structure:');
      expect(result.content).toContain('  - Domain');
      expect(result.content).toContain('  - Specialization');
      expect(result.content).toContain('  - Role');
      expect(result.content).toContain('  - Responsibility');
      expect(result.content).toContain('generated_content: |');
      expect(result.content).toContain('metadata:');
      expect(result.content).toContain('hierarchy_type: "4-layer hierarchy"');
    });

    test("should handle v2 structure", () => {
      const options: OutputOptions = {
        format: 'yaml',
        includeMetadata: true,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Healthcare", "v2", options);

      expect(result.content).toContain('version: v2');
      expect(result.content).toContain('  - Industry');
      expect(result.content).toContain('  - Profession');
      expect(result.content).toContain('  - Field');
      expect(result.content).toContain('  - Task');
      expect(result.content).toContain('hierarchy_type: "6-layer hierarchy"');
    });

    test("should exclude metadata when disabled", () => {
      const options: OutputOptions = {
        format: 'yaml',
        includeMetadata: false,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(sampleContent, "Technology", "v1", options);

      expect(result.content).not.toContain('metadata:');
      expect(result.content).not.toContain('generated_at:');
      expect(result.content).not.toContain('generator:');
    });

    test("should properly indent content", () => {
      const multiLineContent = `const test = "value";
function example() {
  return test;
}`;

      const options: OutputOptions = {
        format: 'yaml',
        includeMetadata: false,
        includeTimestamp: false,
        includeComments: true
      };

      const result = formatter.formatOutput(multiLineContent, "Test", "v1", options);

      expect(result.content).toContain('generated_content: |');
      // Check that content lines are properly indented
      const lines = result.content.split('\n');
      const contentStartIndex = lines.findIndex(line => line.includes('generated_content: |'));
      expect(lines[contentStartIndex + 1]).toMatch(/^  /); // Should start with 2 spaces
    });
  });

  describe("getDefaultOptions", () => {
    test("should return correct default options", () => {
      const defaults = formatter.getDefaultOptions();

      expect(defaults.format).toBe('typescript');
      expect(defaults.includeMetadata).toBe(true);
      expect(defaults.includeTimestamp).toBe(true);
      expect(defaults.includeComments).toBe(true);
    });
  });

  describe("filename generation", () => {
    test("should generate lowercase filenames", () => {
      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: false,
        includeTimestamp: false,
        includeComments: false
      };

      const result = formatter.formatOutput(sampleContent, "TECHNOLOGY", "v1", options);
      expect(result.filename).toBe('technology-hierarchy-example');
    });

    test("should handle domains with spaces", () => {
      const options: OutputOptions = {
        format: 'typescript',
        includeMetadata: false,
        includeTimestamp: false,
        includeComments: false
      };

      const result = formatter.formatOutput(sampleContent, "Health Care", "v1", options);
      expect(result.filename).toBe('health care-hierarchy-example');
    });
  });
});
export interface OutputOptions {
  format: 'typescript' | 'markdown' | 'json' | 'yaml';
  includeMetadata: boolean;
  includeTimestamp: boolean;
  includeComments: boolean;
}

export interface FormattedOutput {
  content: string;
  filename: string;
  extension: string;
  metadata?: any;
}

export class OutputFormatter {
  formatOutput(
      content: string,
      domain: string,
      version: 'v1' | 'v2',
      options: OutputOptions
  ): FormattedOutput {
    switch (options.format) {
      case 'typescript':
        return this.formatTypeScript(content, domain, version, options);
      case 'markdown':
        return this.formatMarkdown(content, domain, version, options);
      case 'json':
        return this.formatJSON(content, domain, version, options);
      case 'yaml':
        return this.formatYAML(content, domain, version, options);
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  private formatTypeScript(
      content: string,
      domain: string,
      version: 'v1' | 'v2',
      options: OutputOptions
  ): FormattedOutput {
    const header = options.includeComments ? `/**
 * ${domain} Professional Hierarchy Example
 * Generated using OpenAI Agents SDK and Sumpin Professional Hierarchy Models
 * Model Version: ${version} (${version === 'v1' ? '4-layer' : '6-layer'} hierarchy)
 * ${options.includeTimestamp ? `Generated on: ${new Date().toISOString()}` : ''}
 */

` : '';

    const imports = `import { 
  Enterprise,
  ${version === 'v1' ? 'DomainModel, SpecializationModel, RoleModel, ResponsibilityModel' : 'DomainModel, IndustryModel, ProfessionModel, FieldModel, RoleModel, TaskModel'}
} from "../../lib/${version}";

`;

    const cleanedContent = this.extractTypeScriptCode(content);

    return {
      content: header + imports + cleanedContent,
      filename: `${domain.toLowerCase()}-hierarchy-example`,
      extension: 'ts',
      metadata: {
        domain,
        version,
        generatedAt: options.includeTimestamp ? new Date().toISOString() : undefined
      }
    };
  }

  private extractTypeScriptCode(content: string): string {
    let cleaned = content;

    cleaned = cleaned.replace(/^#{1,6}\s+.*$/gm, '');

    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
    cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');

    // Remove markdown lists that aren't TypeScript code
    cleaned = cleaned.replace(/^[\s]*[-*+]\s+\*\*([^*]+)\*\*$/gm, '');
    cleaned = cleaned.replace(/^[\s]*[-*+]\s+([^:]+):$/gm, '');

    // Extract TypeScript code blocks
    const codeBlockRegex = /```typescript\s*([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push(match[1].trim());
    }

    // If we found code blocks, use them
    if (codeBlocks.length > 0) {
      return codeBlocks.join('\n\n');
    }

    // Otherwise, try to extract TypeScript-like content
    const lines = cleaned.split('\n');
    const tsLines = [];
    let inCodeSection = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and markdown-like content
      if (!trimmed ||
          trimmed.startsWith('#') ||
          trimmed.startsWith('*') ||
          trimmed.startsWith('-') ||
          trimmed.includes('Below is') ||
          trimmed.includes('Here\'s') ||
          trimmed.includes('TypeScript Code') ||
          trimmed.includes('Professional Hierarchy')) {
        continue;
      }

      // Look for TypeScript patterns
      if (trimmed.includes('interface ') ||
          trimmed.includes('class ') ||
          trimmed.includes('type ') ||
          trimmed.includes('const ') ||
          trimmed.includes('let ') ||
          trimmed.includes('var ') ||
          trimmed.includes('function ') ||
          trimmed.includes('export ') ||
          trimmed.includes('import ') ||
          trimmed.includes('{') ||
          trimmed.includes('}') ||
          trimmed.includes(';') ||
          inCodeSection) {

        tsLines.push(line);
        inCodeSection = true;

        // End code section on certain patterns
        if (trimmed === '}' && !line.includes(',')) {
          inCodeSection = false;
        }
      }
    }

    return tsLines.join('\n').trim() || cleaned.trim();
  }

  private formatMarkdown(
      content: string,
      domain: string,
      version: 'v1' | 'v2',
      options: OutputOptions
  ): FormattedOutput {
    const header = `# ${domain.charAt(0).toUpperCase() + domain.slice(1)} Professional Hierarchy Example

Generated using OpenAI Agents SDK and Sumpin Professional Hierarchy Models

## Overview

This example demonstrates a ${version} professional hierarchy model for the ${domain} domain.

**Model Version:** ${version} (${version === 'v1' ? '4-layer' : '6-layer'} hierarchy)
${options.includeTimestamp ? `**Generated on:** ${new Date().toISOString()}` : ''}

## Structure

${version === 'v1' ? 'Domain → Specialization → Role → Responsibility' : 'Domain → Industry → Profession → Field → Role → Task'}

## Generated Content

\`\`\`typescript
${content}
\`\`\`

## Usage

To use this example:

1. Ensure you have the required dependencies installed:
   \`\`\`bash
   bun add mobx-state-tree mobx uuid
   bun add -d @types/uuid
   \`\`\`

2. Run the example:
   \`\`\`bash
   bun run examples/generated/${domain.toLowerCase()}-hierarchy-example.ts
   \`\`\`

---
*This example was generated automatically and demonstrates best practices for professional hierarchy modeling.*
`;

    return {
      content: header,
      filename: `${domain.toLowerCase()}-hierarchy-example`,
      extension: 'md',
      metadata: {
        domain,
        version,
        generatedAt: options.includeTimestamp ? new Date().toISOString() : undefined
      }
    };
  }

  private formatJSON(
      content: string,
      domain: string,
      version: 'v1' | 'v2',
      options: OutputOptions
  ): FormattedOutput {
    const data = {
      domain,
      version,
      structure: version === 'v1'
          ? ['Domain', 'Specialization', 'Role', 'Responsibility']
          : ['Domain', 'Industry', 'Profession', 'Field', 'Role', 'Task'],
      generatedContent: content,
      ...(options.includeMetadata && {
        metadata: {
          generatedAt: options.includeTimestamp ? new Date().toISOString() : undefined,
          generator: 'OpenAI Agents SDK + Sumpin',
          hierarchyType: `${version === 'v1' ? '4' : '6'}-layer hierarchy`
        }
      })
    };

    return {
      content: JSON.stringify(data, null, 2),
      filename: `${domain.toLowerCase()}-hierarchy-example`,
      extension: 'json',
      metadata: data.metadata
    };
  }

  private formatYAML(
      content: string,
      domain: string,
      version: 'v1' | 'v2',
      options: OutputOptions
  ): FormattedOutput {
    const yamlContent = `domain: ${domain}
version: ${version}
structure:
${(version === 'v1'
            ? ['Domain', 'Specialization', 'Role', 'Responsibility']
            : ['Domain', 'Industry', 'Profession', 'Field', 'Role', 'Task']
    ).map(item => `  - ${item}`).join('\n')}

generated_content: |
${content.split('\n').map(line => `  ${line}`).join('\n')}

${options.includeMetadata ? `metadata:
  generated_at: ${options.includeTimestamp ? new Date().toISOString() : 'null'}
  generator: "OpenAI Agents SDK + Sumpin"
  hierarchy_type: "${version === 'v1' ? '4' : '6'}-layer hierarchy"` : ''}`;

    return {
      content: yamlContent,
      filename: `${domain.toLowerCase()}-hierarchy-example`,
      extension: 'yaml',
      metadata: {
        domain,
        version,
        generatedAt: options.includeTimestamp ? new Date().toISOString() : undefined
      }
    };
  }

  getDefaultOptions(): OutputOptions {
    return {
      format: 'typescript',
      includeMetadata: true,
      includeTimestamp: true,
      includeComments: true
    };
  }
}

export default OutputFormatter;

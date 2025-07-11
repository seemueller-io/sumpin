#!/usr/bin/env bun

/**
 * Sumpin CLI - Professional Hierarchy Generator
 * 
 * A command-line interface for generating professional hierarchies from natural language specifications.
 * Leverages the existing hierarchy generation infrastructure to provide a clean, professional CLI experience.
 */

import { parseArgs } from 'util';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { generateHierarchy } from './generate-template';
import HierarchyAgent from './lib/agent-wrapper';

const CLI_VERSION = '1.0.0';
const DEFAULT_OUTPUT_DIR = './output';

interface CLIOptions {
  help?: boolean;
  version?: boolean;
  output?: string;
  format?: 'json' | 'typescript' | 'both';
  complexity?: 'simple' | 'medium' | 'complex';
  hierarchyVersion?: 'v1' | 'v2';
  stream?: boolean;
  quiet?: boolean;
  skills?: boolean;
  tools?: boolean;
  examples?: boolean;
}

const HELP_TEXT = `
Sumpin CLI v${CLI_VERSION} - Professional Hierarchy Generator

USAGE:
  bun cli.ts [OPTIONS] "<natural language specification>"

DESCRIPTION:
  Generate professional hierarchies from natural language descriptions.
  Supports both simple JSON output and full TypeScript code generation.

ARGUMENTS:
  specification    Natural language description of the hierarchy to generate
                  Example: "Create a healthcare hierarchy for mental health services"

OPTIONS:
  -h, --help              Show this help message
  -v, --version           Show version information
  -o, --output DIR        Output directory (default: ./output)
  -f, --format FORMAT     Output format: json, typescript, both (default: json)
  -c, --complexity LEVEL  Complexity level: simple, medium, complex (default: medium)
  --hierarchy-version VER Hierarchy version: v1, v2 (default: v2)
  --stream                Enable streaming output for real-time feedback
  --quiet                 Suppress progress messages
  --skills                Include skills and competencies (default: true)
  --tools                 Include tools and technologies (default: true)
  --examples              Include practical examples (default: true)

EXAMPLES:
  # Basic usage - generate JSON hierarchy
  bun cli.ts "Create a technology hierarchy for AI development"

  # Generate TypeScript code with streaming
  bun cli.ts --format typescript --stream "Healthcare hierarchy for emergency medicine"

  # Complex v1 hierarchy with custom output directory
  bun cli.ts -o ./my-hierarchies -c complex --hierarchy-version v1 "Finance hierarchy for investment banking"

  # Generate both formats quietly
  bun cli.ts --format both --quiet "Education hierarchy for online learning platforms"

OUTPUT:
  Generated files will be saved to the specified output directory with descriptive names.
  JSON format: Creates .json files with the hierarchy data
  TypeScript format: Creates .ts files with executable TypeScript code
`;

// Parse command line arguments
function parseCliArgs(): { options: CLIOptions; specification: string } {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
      output: { type: 'string', short: 'o' },
      format: { type: 'string', short: 'f' },
      complexity: { type: 'string', short: 'c' },
      'hierarchy-version': { type: 'string' },
      stream: { type: 'boolean' },
      quiet: { type: 'boolean' },
      skills: { type: 'boolean' },
      tools: { type: 'boolean' },
      examples: { type: 'boolean' },
    },
    allowPositionals: true,
  });

  const options: CLIOptions = {
    help: values.help,
    version: values.version,
    output: values.output || DEFAULT_OUTPUT_DIR,
    format: (values.format as any) || 'json',
    complexity: (values.complexity as any) || 'medium',
    hierarchyVersion: (values['hierarchy-version'] as any) || 'v2',
    stream: values.stream || false,
    quiet: values.quiet || false,
    skills: values.skills !== false,
    tools: values.tools !== false,
    examples: values.examples !== false,
  };

  const specification = positionals.join(' ');

  return { options, specification };
}

// Validate CLI options
function validateOptions(options: CLIOptions, specification: string): void {
  if (!['json', 'typescript', 'both'].includes(options.format!)) {
    console.error('❌ Error: Invalid format. Must be one of: json, typescript, both');
    process.exit(1);
  }

  if (!['simple', 'medium', 'complex'].includes(options.complexity!)) {
    console.error('❌ Error: Invalid complexity. Must be one of: simple, medium, complex');
    process.exit(1);
  }

  if (!['v1', 'v2'].includes(options.hierarchyVersion!)) {
    console.error('❌ Error: Invalid hierarchy version. Must be one of: v1, v2');
    process.exit(1);
  }

  if (!specification.trim()) {
    console.error('❌ Error: Natural language specification is required');
    console.error('Use --help for usage information');
    process.exit(1);
  }
}

// Generate filename from specification
function generateFilename(specification: string, format: string): string {
  const cleanSpec = specification
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  return `hierarchy-${cleanSpec}-${timestamp}`;
}

// Generate hierarchy using the simple JSON approach
async function generateJsonHierarchy(specification: string, options: CLIOptions): Promise<any> {
  if (!options.quiet) {
    console.log('🔄 Generating hierarchy using JSON approach...');
  }

  const hierarchy = await generateHierarchy(specification);
  return hierarchy.toJSON();
}

// Generate hierarchy using the agent-based TypeScript approach
async function generateTypescriptHierarchy(specification: string, options: CLIOptions): Promise<string> {
  if (!options.quiet) {
    console.log('🔄 Generating hierarchy using TypeScript agent approach...');
  }

  const hierarchyAgent = new HierarchyAgent({
    name: 'CLI Hierarchy Generator',
    instructions: `Generate professional hierarchy TypeScript code based on user specifications.
    Focus on creating clean, implementable code that demonstrates real-world organizational structures.`,
  });

  const generationOptions = {
    domain: extractDomain(specification),
    version: options.hierarchyVersion!,
    complexity: options.complexity!,
    includeSkills: options.skills!,
    includeTools: options.tools!,
    includeExamples: options.examples!,
  };

  if (options.stream) {
    return await hierarchyAgent.generateHierarchyWithStreaming(
      generationOptions,
      options.quiet ? undefined : (event) => {
        if (event.type === 'raw_model_stream_event' && event.delta?.content) {
          process.stdout.write('.');
        }
      }
    ).then(result => result.content);
  } else {
    const result = await hierarchyAgent.generateHierarchy(generationOptions);
    return result.content;
  }
}

// Extract domain from specification (simple heuristic)
function extractDomain(specification: string): string {
  const words = specification.toLowerCase().split(/\s+/);
  
  // Look for domain keywords
  const domainKeywords = [
    'healthcare', 'technology', 'finance', 'education', 'manufacturing',
    'retail', 'consulting', 'media', 'logistics', 'legal', 'construction',
    'hospitality', 'automotive', 'aerospace', 'energy', 'agriculture'
  ];

  for (const keyword of domainKeywords) {
    if (words.some(word => word.includes(keyword))) {
      return keyword;
    }
  }

  // Fallback: use first meaningful word
  const meaningfulWords = words.filter(word => 
    word.length > 3 && 
    !['create', 'generate', 'build', 'make', 'hierarchy', 'for', 'the', 'and', 'with'].includes(word)
  );

  return meaningfulWords[0] || 'general';
}

// Save output to files
async function saveOutput(
  content: any, 
  filename: string, 
  format: string, 
  outputDir: string, 
  quiet: boolean
): Promise<void> {
  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = resolve(outputDir);

  if (format === 'json' || format === 'both') {
    const jsonFile = join(outputPath, `${filename}.json`);
    const jsonContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    writeFileSync(jsonFile, jsonContent);
    if (!quiet) {
      console.log(`✅ JSON hierarchy saved: ${jsonFile}`);
    }
  }

  if (format === 'typescript' || format === 'both') {
    const tsFile = join(outputPath, `${filename}.ts`);
    const tsContent = typeof content === 'string' ? content : `// Generated hierarchy\nexport const hierarchy = ${JSON.stringify(content, null, 2)};`;
    writeFileSync(tsFile, tsContent);
    if (!quiet) {
      console.log(`✅ TypeScript hierarchy saved: ${tsFile}`);
    }
  }
}

// Main CLI function
async function main(): Promise<void> {
  try {
    const { options, specification } = parseCliArgs();

    // Handle help and version
    if (options.help) {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (options.version) {
      console.log(`Sumpin CLI v${CLI_VERSION}`);
      process.exit(0);
    }

    // Validate options
    validateOptions(options, specification);

    if (!options.quiet) {
      console.log(`🚀 Sumpin CLI v${CLI_VERSION} - Professional Hierarchy Generator`);
      console.log(`📝 Specification: "${specification}"`);
      console.log(`⚙️  Configuration:`);
      console.log(`   Format: ${options.format}`);
      console.log(`   Complexity: ${options.complexity}`);
      console.log(`   Version: ${options.hierarchyVersion}`);
      console.log(`   Output: ${options.output}`);
      console.log();
    }

    const filename = generateFilename(specification, options.format!);
    let content: any;

    // Generate based on format preference
    if (options.format === 'json') {
      content = await generateJsonHierarchy(specification, options);
    } else if (options.format === 'typescript') {
      content = await generateTypescriptHierarchy(specification, options);
    } else if (options.format === 'both') {
      // Generate both formats
      const jsonContent = await generateJsonHierarchy(specification, options);
      const tsContent = await generateTypescriptHierarchy(specification, options);
      
      await saveOutput(jsonContent, filename, 'json', options.output!, options.quiet!);
      await saveOutput(tsContent, filename, 'typescript', options.output!, options.quiet!);
      
      if (!options.quiet) {
        console.log('\n🎉 Hierarchy generation complete!');
        console.log(`📁 Files saved to: ${resolve(options.output!)}`);
      }
      return;
    }

    // Save single format output
    await saveOutput(content, filename, options.format!, options.output!, options.quiet!);

    if (!options.quiet) {
      console.log('\n🎉 Hierarchy generation complete!');
      console.log(`📁 Files saved to: ${resolve(options.output!)}`);
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (import.meta.main) {
  main();
}

export { main as runCLI };
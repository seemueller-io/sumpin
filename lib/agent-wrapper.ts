import { Agent, StreamedRunResult } from '@openai/agents';
import HierarchyGenerator, { GenerationParams } from './components/hierarchy-generator';
import TemplateManager, { DomainTemplate } from './components/template-manager';
import OutputFormatter, { OutputOptions, FormattedOutput } from './components/output-formatter';

export interface AgentConfig {
  name: string;
  instructions: string;
  model?: string;
}

export interface HierarchyGenerationOptions extends GenerationParams {
  outputFormat?: OutputOptions;
  templateKey?: string;
  stream?: boolean;
}

export class HierarchyAgent {
  private agent: Agent;
  private generator: HierarchyGenerator;
  private templateManager: TemplateManager;
  private outputFormatter: OutputFormatter;

  constructor(config: AgentConfig) {
    this.agent = new Agent({
      name: config.name,
      instructions: config.instructions,
      model: config.model || 'gpt-4o-mini'
    });

    this.generator = new HierarchyGenerator(this.agent);
    this.templateManager = new TemplateManager();
    this.outputFormatter = new OutputFormatter();
  }

  async generateHierarchy(options: HierarchyGenerationOptions): Promise<FormattedOutput | StreamedRunResult> {
    let template: DomainTemplate;

    if (options.templateKey) {
      template = this.templateManager.getTemplate(options.templateKey);
      if (!template) {
        throw new Error(`Template not found: ${options.templateKey}`);
      }
    } else {
      // Create a default template for the domain
      const version = options.version || 'v2';
      template = this.templateManager.createCustomTemplate(
        `${options.domain}-${version}`,
        options.domain,
        version
      );
    }

    const generationParams: GenerationParams = {
      domain: options.domain,
      complexity: options.complexity || 'medium',
      includeSkills: options.includeSkills ?? true,
      includeTools: options.includeTools ?? true,
      includeExamples: options.includeExamples ?? true,
      stream: options.stream
    };

    const content = await this.generator.generateFromTemplate(template, generationParams);

    // If streaming, return the stream directly
    if (options.stream && content instanceof Object && 'toStream' in content) {
      return content as StreamedRunResult;
    }

    const outputOptions = options.outputFormat || this.outputFormatter.getDefaultOptions();
    const formattedOutput = this.outputFormatter.formatOutput(
      content as string,
      options.domain,
      template.version,
      outputOptions
    );

    return formattedOutput;
  }

  // New method for streaming with enhanced visibility
  async generateHierarchyWithStreaming(
    options: HierarchyGenerationOptions,
    onStreamEvent?: (event: any) => void
  ): Promise<FormattedOutput> {
    let template: DomainTemplate;

    if (options.templateKey) {
      template = this.templateManager.getTemplate(options.templateKey);
      if (!template) {
        throw new Error(`Template not found: ${options.templateKey}`);
      }
    } else {
      // Create a default template for the domain
      const version = options.version || 'v2';
      template = this.templateManager.createCustomTemplate(
        `${options.domain}-${version}`,
        options.domain,
        version
      );
    }

    const generationParams: GenerationParams = {
      domain: options.domain,
      complexity: options.complexity || 'medium',
      includeSkills: options.includeSkills ?? true,
      includeTools: options.includeTools ?? true,
      includeExamples: options.includeExamples ?? true
    };

    const content = await this.generator.generateFromTemplateWithStreaming(
      template, 
      generationParams, 
      onStreamEvent
    );

    // Format the output
    const outputOptions = options.outputFormat || this.outputFormatter.getDefaultOptions();
    const formattedOutput = this.outputFormatter.formatOutput(
      content,
      options.domain,
      template.version,
      outputOptions
    );

    return formattedOutput;
  }

  async generateExample(
    domain: string, 
    version: 'v1' | 'v2' = 'v2',
    complexity: 'simple' | 'medium' | 'complex' = 'medium'
  ): Promise<FormattedOutput> {
    return this.generateHierarchy({
      domain,
      version,
      complexity,
      includeSkills: true,
      includeTools: true,
      includeExamples: true
    });
  }

  // Template management methods
  getAvailableTemplates(): DomainTemplate[] {
    return this.templateManager.getAllTemplates();
  }

  getTemplatesByDomain(domain: string): DomainTemplate[] {
    return this.templateManager.getTemplatesByDomain(domain);
  }

  getTemplatesByVersion(version: 'v1' | 'v2'): DomainTemplate[] {
    return this.templateManager.getTemplatesByVersion(version);
  }

  addCustomTemplate(key: string, template: DomainTemplate): void {
    this.templateManager.addTemplate(key, template);
  }

  // Validation and optimization methods
  async validateHierarchy(hierarchyData: any): Promise<boolean> {
    // TODO: Implement validation logic using the agent
    // Could validate structure, naming conventions, completeness, etc.
    return true;
  }

  async optimizeHierarchy(hierarchyData: any): Promise<any> {
    // TODO: Implement optimization logic using the agent
    // Could suggest improvements, fill gaps, optimize structure, etc.
    return hierarchyData;
  }

  // Batch generation methods
  async generateMultipleExamples(
    domains: string[],
    version: 'v1' | 'v2' = 'v2',
    outputFormat?: OutputOptions
  ): Promise<FormattedOutput[]> {
    const results: FormattedOutput[] = [];

    for (const domain of domains) {
      try {
        const result = await this.generateHierarchy({
          domain,
          version,
          complexity: 'medium',
          includeSkills: true,
          includeTools: true,
          includeExamples: true,
          outputFormat
        });
        results.push(result);
      } catch (error) {
        console.error(`Error generating example for ${domain}:`, error);
      }
    }

    return results;
  }
}

export default HierarchyAgent;

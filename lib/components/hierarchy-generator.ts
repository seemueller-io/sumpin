import { Agent, run, StreamedRunResult } from '@openai/agents';

export interface HierarchyTemplate {
  version: 'v1' | 'v2';
  structure: string[];
  description: string;
}

export interface GenerationParams {
  domain: string;
  complexity: 'simple' | 'medium' | 'complex';
  includeSkills: boolean;
  includeTools: boolean;
  includeExamples: boolean;
  stream?: boolean;
}

export class HierarchyGenerator {
  private agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  async generateFromTemplate(template: HierarchyTemplate, params: GenerationParams): Promise<string | StreamedRunResult> {
    const prompt = this.buildPrompt(template, params);

    if (params.stream) {
      return await run(this.agent, prompt, { stream: true });
    } else {
      const result = await run(this.agent, prompt);
      return result.finalOutput;
    }
  }

  // Helper method to stream and collect final output
  async generateFromTemplateWithStreaming(
      template: HierarchyTemplate,
      params: GenerationParams,
      onStreamEvent?: (event: any) => void
  ): Promise<string> {
    const prompt = this.buildPrompt(template, params);
    console.log('🔄 Starting hierarchy generation...');

    const stream = await run(this.agent, prompt, { stream: true });
    let content = '';

    for await (const event of stream) {
      if (event.type === 'raw_model_stream_event' && event.data.delta) {
        // console.log(event.data.delta)
        content += event.delta;
        process.stdout.write(event.data.delta);
      }

      if (event.type === 'agent_updated_stream_event') {
        console.log(`\n📝 Agent: ${event.agent.name} is processing...`);
      } else if (event.type === 'run_item_stream_event') {
        if (event.item.type === 'tool_call_item') {
          console.log('\n🔧 Tool being called...');
        } else if (event.item.type === 'message_output_item') {
          console.log('\n💬 Generating response...');
        }
      }

      // Allow custom event handling
      if (onStreamEvent) {
        onStreamEvent(event);
      }
    }

    console.log('\n✅ Hierarchy generation complete!');
    return stream.finalOutput;
  }

  private buildPrompt(template: HierarchyTemplate, params: GenerationParams): string {
    const structureDescription = template.version === 'v1'
        ? 'Domain → Specialization → Role → Responsibility'
        : 'Domain → Industry → Profession → Field → Role → Task';

    const importStatement = template.version === 'v1'
        ? 'import { Enterprise, DomainModel, SpecializationModel, RoleModel, ResponsibilityModel } from "../../lib/v1";'
        : 'import { Enterprise, DomainModel, IndustryModel, ProfessionModel, FieldModel, RoleModel, TaskModel } from "../../lib/v2";';

    return `
Generate ONLY TypeScript code for a professional hierarchy in the ${params.domain} domain using the ${template.version} structure.

Structure: ${structureDescription}
Complexity Level: ${params.complexity}
${params.includeSkills ? '✓ Include relevant skills and competencies' : ''}
${params.includeTools ? '✓ Include tools and technologies' : ''}
${params.includeExamples ? '✓ Include practical examples and use cases' : ''}

IMPORTANT: Output ONLY valid TypeScript code. Do not include any markdown, explanations, or comments outside of TypeScript comments.

Requirements:
1. Start with the import statement: ${importStatement}
2. Create a realistic, comprehensive hierarchy using MobX State Tree models
3. Use appropriate professional terminology
4. Ensure logical relationships between levels
5. ${params.complexity === 'complex' ? 'Include multiple branches and detailed attributes' :
        params.complexity === 'medium' ? 'Include moderate detail with key attributes' :
            'Keep it simple with essential elements only'}

The code should demonstrate:
- Creating the hierarchy structure using the imported models
- Adding relevant attributes (skills, tools, examples)
- Basic operations (create, read, update)
- Real-world application examples as TypeScript code

Output format: Pure TypeScript code only, no markdown or explanations.
`;
  }
}

export default HierarchyGenerator;

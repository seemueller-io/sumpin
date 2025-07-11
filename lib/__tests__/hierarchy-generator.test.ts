import { expect, test, describe, mock, beforeEach } from "bun:test";
import { HierarchyGenerator } from "../components/hierarchy-generator";
import type { HierarchyTemplate, GenerationParams } from "../components/hierarchy-generator";

// Mock the @openai/agents module
const mockRun = mock(() => Promise.resolve({ finalOutput: "Generated hierarchy content" }));
const mockRunStream = mock(() => Promise.resolve({
  finalOutput: "Streamed hierarchy content",
  [Symbol.asyncIterator]: async function* () {
    yield { type: 'raw_model_stream_event', data: { delta: 'test' }, delta: 'test' };
    yield { type: 'agent_updated_stream_event', agent: { name: 'TestAgent' } };
    yield { type: 'run_item_stream_event', item: { type: 'tool_call_item' } };
    yield { type: 'run_item_stream_event', item: { type: 'message_output_item' } };
  }
}));

mock.module('@openai/agents', () => ({
  Agent: class MockAgent {},
  run: mockRun,
  StreamedRunResult: class MockStreamedRunResult {}
}));

describe("HierarchyGenerator", () => {
  const mockAgent = {} as any; // Mock agent instance
  let generator: HierarchyGenerator;

  beforeEach(() => {
    generator = new HierarchyGenerator(mockAgent);
    mockRun.mockClear();
    mockRunStream.mockClear();
  });

  describe("generateFromTemplate", () => {
    const mockTemplate: HierarchyTemplate = {
      version: 'v1',
      structure: ['Domain', 'Specialization', 'Role', 'Responsibility'],
      description: 'Test template'
    };

    const mockParams: GenerationParams = {
      domain: 'Technology',
      complexity: 'medium',
      includeSkills: true,
      includeTools: true,
      includeExamples: true,
      stream: false
    };

    test("should generate hierarchy without streaming", async () => {
      const result = await generator.generateFromTemplate(mockTemplate, mockParams);

      expect(mockRun).toHaveBeenCalledTimes(1);
      expect(result).toBe("Generated hierarchy content");
    });

    test("should generate hierarchy with streaming when stream is true", async () => {
      const streamParams = { ...mockParams, stream: true };
      mockRun.mockResolvedValueOnce(mockRunStream());

      const result = await generator.generateFromTemplate(mockTemplate, streamParams);

      expect(mockRun).toHaveBeenCalledWith(mockAgent, expect.any(String), { stream: true });
    });

    test("should build correct prompt for v1 template", async () => {
      await generator.generateFromTemplate(mockTemplate, mockParams);

      const calledPrompt = mockRun.mock.calls[0][1];
      expect(calledPrompt).toContain('Technology domain');
      expect(calledPrompt).toContain('Domain → Specialization → Role → Responsibility');
      expect(calledPrompt).toContain('medium');
      expect(calledPrompt).toContain('✓ Include relevant skills');
      expect(calledPrompt).toContain('✓ Include tools and technologies');
      expect(calledPrompt).toContain('✓ Include practical examples');
      expect(calledPrompt).toContain('import { Enterprise, DomainModel, SpecializationModel, RoleModel, ResponsibilityModel } from "../../lib/v1"');
    });

    test("should build correct prompt for v2 template", async () => {
      const v2Template: HierarchyTemplate = {
        version: 'v2',
        structure: ['Domain', 'Industry', 'Profession', 'Field', 'Role', 'Task'],
        description: 'Test v2 template'
      };

      await generator.generateFromTemplate(v2Template, mockParams);

      const calledPrompt = mockRun.mock.calls[0][1];
      expect(calledPrompt).toContain('Domain → Industry → Profession → Field → Role → Task');
      expect(calledPrompt).toContain('import { Enterprise, DomainModel, IndustryModel, ProfessionModel, FieldModel, RoleModel, TaskModel } from "../../lib/v2"');
    });

    test("should handle different complexity levels", async () => {
      // Test simple complexity
      const simpleParams = { ...mockParams, complexity: 'simple' as const };
      await generator.generateFromTemplate(mockTemplate, simpleParams);
      let calledPrompt = mockRun.mock.calls[0][1];
      expect(calledPrompt).toContain('Keep it simple with essential elements only');

      mockRun.mockClear();

      // Test complex complexity
      const complexParams = { ...mockParams, complexity: 'complex' as const };
      await generator.generateFromTemplate(mockTemplate, complexParams);
      calledPrompt = mockRun.mock.calls[0][1];
      expect(calledPrompt).toContain('Include multiple branches and detailed attributes');
    });

    test("should handle optional features being disabled", async () => {
      const minimalParams: GenerationParams = {
        domain: 'Technology',
        complexity: 'medium',
        includeSkills: false,
        includeTools: false,
        includeExamples: false,
        stream: false
      };

      await generator.generateFromTemplate(mockTemplate, minimalParams);

      const calledPrompt = mockRun.mock.calls[0][1];
      expect(calledPrompt).not.toContain('✓ Include relevant skills');
      expect(calledPrompt).not.toContain('✓ Include tools and technologies');
      expect(calledPrompt).not.toContain('✓ Include practical examples');
    });
  });

  describe("generateFromTemplateWithStreaming", () => {
    const mockTemplate: HierarchyTemplate = {
      version: 'v1',
      structure: ['Domain', 'Specialization', 'Role', 'Responsibility'],
      description: 'Test template'
    };

    const mockParams: GenerationParams = {
      domain: 'Technology',
      complexity: 'medium',
      includeSkills: true,
      includeTools: true,
      includeExamples: true
    };

    test("should handle streaming with custom event handler", async () => {
      const mockEventHandler = mock(() => {});

      // Mock console.log to avoid output during tests
      const originalConsoleLog = console.log;
      console.log = mock(() => {});

      // Mock process.stdout.write
      const originalWrite = process.stdout.write;
      process.stdout.write = mock(() => true);

      mockRun.mockResolvedValueOnce(mockRunStream());

      const result = await generator.generateFromTemplateWithStreaming(
        mockTemplate, 
        mockParams, 
        mockEventHandler
      );

      expect(result).toBe("Streamed hierarchy content");
      expect(mockEventHandler).toHaveBeenCalled();

      // Restore original functions
      console.log = originalConsoleLog;
      process.stdout.write = originalWrite;
    });

    test("should handle streaming without custom event handler", async () => {
      // Mock console.log to avoid output during tests
      const originalConsoleLog = console.log;
      console.log = mock(() => {});

      // Mock process.stdout.write
      const originalWrite = process.stdout.write;
      process.stdout.write = mock(() => true);

      mockRun.mockResolvedValueOnce(mockRunStream());

      const result = await generator.generateFromTemplateWithStreaming(mockTemplate, mockParams);

      expect(result).toBe("Streamed hierarchy content");

      // Restore original functions
      console.log = originalConsoleLog;
      process.stdout.write = originalWrite;
    });
  });

  describe("buildPrompt", () => {
    test("should create valid prompt structure", async () => {
      const template: HierarchyTemplate = {
        version: 'v1',
        structure: ['Domain', 'Specialization', 'Role', 'Responsibility'],
        description: 'Test template'
      };

      const params: GenerationParams = {
        domain: 'Healthcare',
        complexity: 'complex',
        includeSkills: true,
        includeTools: false,
        includeExamples: true
      };

      await generator.generateFromTemplate(template, params);

      const prompt = mockRun.mock.calls[0][1];

      // Check that prompt contains all expected elements
      expect(prompt).toContain('Generate ONLY TypeScript code');
      expect(prompt).toContain('Healthcare domain');
      expect(prompt).toContain('complex');
      expect(prompt).toContain('IMPORTANT: Output ONLY valid TypeScript code');
      expect(prompt).toContain('Requirements:');
      expect(prompt).toContain('The code should demonstrate:');
      expect(prompt).toContain('Output format: Pure TypeScript code only');
    });
  });
});

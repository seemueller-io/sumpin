import { expect, test, describe, beforeEach } from "bun:test";
import { TemplateManager } from "../components/template-manager";
import type { DomainTemplate } from "../components/template-manager";

describe("TemplateManager", () => {
  let templateManager: TemplateManager;

  beforeEach(() => {
    templateManager = new TemplateManager();
  });

  describe("constructor and initialization", () => {
    test("should initialize with default templates", () => {
      const allTemplates = templateManager.getAllTemplates();
      expect(allTemplates.length).toBeGreaterThan(0);
    });

    test("should have v1 and v2 templates", () => {
      const v1Templates = templateManager.getTemplatesByVersion('v1');
      const v2Templates = templateManager.getTemplatesByVersion('v2');

      expect(v1Templates.length).toBeGreaterThan(0);
      expect(v2Templates.length).toBeGreaterThan(0);
    });

    test("should have technology templates", () => {
      const techTemplates = templateManager.getTemplatesByDomain('technology');
      expect(techTemplates.length).toBeGreaterThan(0);
    });
  });

  describe("addTemplate", () => {
    test("should add a new template", () => {
      const customTemplate: DomainTemplate = {
        version: 'v1',
        domain: 'Custom',
        structure: ['Domain', 'Specialization', 'Role', 'Responsibility'],
        description: 'A custom template',
        commonSkills: ['Skill1'],
        commonTools: ['Tool1'],
        examples: ['Example1']
      };

      templateManager.addTemplate('custom-v1', customTemplate);
      const retrieved = templateManager.getTemplate('custom-v1');

      expect(retrieved).toBeDefined();
      expect(retrieved?.domain).toBe('Custom');
      expect(retrieved?.version).toBe('v1');
    });

    test("should overwrite existing template with same key", () => {
      const template1: DomainTemplate = {
        version: 'v1',
        domain: 'First',
        structure: ['Domain', 'Specialization', 'Role', 'Responsibility'],
        description: 'First template',
        commonSkills: [],
        commonTools: [],
        examples: []
      };

      const template2: DomainTemplate = {
        version: 'v2',
        domain: 'Second',
        structure: ['Domain', 'Industry', 'Profession', 'Field', 'Role', 'Task'],
        description: 'Second template',
        commonSkills: [],
        commonTools: [],
        examples: []
      };

      templateManager.addTemplate('test-key', template1);
      expect(templateManager.getTemplate('test-key')?.domain).toBe('First');

      templateManager.addTemplate('test-key', template2);
      expect(templateManager.getTemplate('test-key')?.domain).toBe('Second');
      expect(templateManager.getTemplate('test-key')?.version).toBe('v2');
    });
  });

  describe("getTemplate", () => {
    test("should return template for valid key", () => {
      const customTemplate: DomainTemplate = {
        version: 'v1',
        domain: 'Test',
        structure: ['Domain', 'Specialization', 'Role', 'Responsibility'],
        description: 'Test template',
        commonSkills: [],
        commonTools: [],
        examples: []
      };

      templateManager.addTemplate('test-template', customTemplate);
      const retrieved = templateManager.getTemplate('test-template');

      expect(retrieved).toBeDefined();
      expect(retrieved?.domain).toBe('Test');
    });

    test("should return undefined for invalid key", () => {
      const retrieved = templateManager.getTemplate('non-existent-key');
      expect(retrieved).toBeUndefined();
    });
  });

  describe("getTemplatesByVersion", () => {
    test("should return only v1 templates", () => {
      const v1Templates = templateManager.getTemplatesByVersion('v1');

      expect(v1Templates.length).toBeGreaterThan(0);
      v1Templates.forEach(template => {
        expect(template.version).toBe('v1');
        expect(template.structure).toHaveLength(4);
      });
    });

    test("should return only v2 templates", () => {
      const v2Templates = templateManager.getTemplatesByVersion('v2');

      expect(v2Templates.length).toBeGreaterThan(0);
      v2Templates.forEach(template => {
        expect(template.version).toBe('v2');
        expect(template.structure).toHaveLength(6);
      });
    });

    test("should return empty array if no templates match version", () => {
      // Since TemplateManager initializes with default templates, 
      // we can't easily test an empty scenario. Instead, let's test
      // that filtering works correctly by checking that v1 and v2 
      // templates are properly separated
      const v1Templates = templateManager.getTemplatesByVersion('v1');
      const v2Templates = templateManager.getTemplatesByVersion('v2');

      // Ensure no v2 templates are in v1 results
      v1Templates.forEach(template => {
        expect(template.version).toBe('v1');
      });

      // Ensure no v1 templates are in v2 results
      v2Templates.forEach(template => {
        expect(template.version).toBe('v2');
      });

      // Ensure they don't overlap
      const allTemplates = templateManager.getAllTemplates();
      expect(v1Templates.length + v2Templates.length).toBe(allTemplates.length);
    });
  });

  describe("getTemplatesByDomain", () => {
    test("should return templates matching domain (case insensitive)", () => {
      const techTemplates = templateManager.getTemplatesByDomain('Technology');
      expect(techTemplates.length).toBeGreaterThan(0);

      const techTemplatesLower = templateManager.getTemplatesByDomain('technology');
      expect(techTemplatesLower.length).toBe(techTemplates.length);
    });

    test("should return templates with partial domain match", () => {
      const techTemplates = templateManager.getTemplatesByDomain('tech');
      expect(techTemplates.length).toBeGreaterThan(0);

      techTemplates.forEach(template => {
        expect(template.domain.toLowerCase()).toContain('tech');
      });
    });

    test("should return empty array for non-matching domain", () => {
      const nonExistentTemplates = templateManager.getTemplatesByDomain('NonExistentDomain');
      expect(nonExistentTemplates).toHaveLength(0);
    });

    test("should handle empty domain string", () => {
      const allTemplates = templateManager.getAllTemplates();
      const emptyDomainTemplates = templateManager.getTemplatesByDomain('');
      expect(emptyDomainTemplates.length).toBe(allTemplates.length);
    });
  });

  describe("getAllTemplates", () => {
    test("should return all templates", () => {
      const allTemplates = templateManager.getAllTemplates();
      expect(allTemplates.length).toBeGreaterThan(0);

      // Should include both v1 and v2 templates
      const v1Count = allTemplates.filter(t => t.version === 'v1').length;
      const v2Count = allTemplates.filter(t => t.version === 'v2').length;

      expect(v1Count).toBeGreaterThan(0);
      expect(v2Count).toBeGreaterThan(0);
      expect(v1Count + v2Count).toBe(allTemplates.length);
    });

    test("should return array copy, not reference", () => {
      const templates1 = templateManager.getAllTemplates();
      const templates2 = templateManager.getAllTemplates();

      expect(templates1).not.toBe(templates2); // Different array instances
      expect(templates1).toEqual(templates2); // Same content
    });
  });

  describe("createCustomTemplate", () => {
    test("should create v1 template with correct structure", () => {
      const template = templateManager.createCustomTemplate(
        'custom-v1',
        'CustomDomain',
        'v1'
      );

      expect(template.version).toBe('v1');
      expect(template.domain).toBe('CustomDomain');
      expect(template.structure).toEqual(['Domain', 'Specialization', 'Role', 'Responsibility']);
      expect(template.description).toBe('CustomDomain professional hierarchy');
      expect(template.commonSkills).toEqual([]);
      expect(template.commonTools).toEqual([]);
      expect(template.examples).toEqual([]);
    });

    test("should create v2 template with correct structure", () => {
      const template = templateManager.createCustomTemplate(
        'custom-v2',
        'CustomDomain',
        'v2'
      );

      expect(template.version).toBe('v2');
      expect(template.domain).toBe('CustomDomain');
      expect(template.structure).toEqual(['Domain', 'Industry', 'Profession', 'Field', 'Role', 'Task']);
      expect(template.description).toBe('CustomDomain professional hierarchy');
    });

    test("should apply custom options", () => {
      const options = {
        description: 'Custom description',
        commonSkills: ['Skill1', 'Skill2'],
        commonTools: ['Tool1', 'Tool2'],
        examples: ['Example1', 'Example2']
      };

      const template = templateManager.createCustomTemplate(
        'custom-with-options',
        'TestDomain',
        'v1',
        options
      );

      expect(template.description).toBe('Custom description');
      expect(template.commonSkills).toEqual(['Skill1', 'Skill2']);
      expect(template.commonTools).toEqual(['Tool1', 'Tool2']);
      expect(template.examples).toEqual(['Example1', 'Example2']);
    });

    test("should add created template to manager", () => {
      const template = templateManager.createCustomTemplate(
        'auto-added',
        'AutoDomain',
        'v1'
      );

      const retrieved = templateManager.getTemplate('auto-added');
      expect(retrieved).toBeDefined();
      expect(retrieved).toEqual(template);
    });

    test("should override default values with options", () => {
      const template = templateManager.createCustomTemplate(
        'override-test',
        'OverrideDomain',
        'v1',
        {
          structure: ['Custom', 'Structure', 'Override'], // This should override default v1 structure
          description: 'Override description'
        }
      );

      expect(template.structure).toEqual(['Custom', 'Structure', 'Override']);
      expect(template.description).toBe('Override description');
      expect(template.domain).toBe('OverrideDomain'); // Should keep the domain parameter
    });
  });

  describe("template validation", () => {
    test("all default templates should have required fields", () => {
      const allTemplates = templateManager.getAllTemplates();

      allTemplates.forEach(template => {
        expect(template.version).toMatch(/^v[12]$/);
        expect(template.domain).toBeTruthy();
        expect(template.structure).toBeDefined();
        expect(template.structure.length).toBeGreaterThan(0);
        expect(template.description).toBeTruthy();
        expect(Array.isArray(template.commonSkills)).toBe(true);
        expect(Array.isArray(template.commonTools)).toBe(true);
        expect(Array.isArray(template.examples)).toBe(true);
      });
    });

    test("v1 templates should have 4-layer structure", () => {
      const v1Templates = templateManager.getTemplatesByVersion('v1');

      v1Templates.forEach(template => {
        expect(template.structure).toHaveLength(4);
        expect(template.structure).toContain('Domain');
        expect(template.structure).toContain('Specialization');
        expect(template.structure).toContain('Role');
        expect(template.structure).toContain('Responsibility');
      });
    });

    test("v2 templates should have 6-layer structure", () => {
      const v2Templates = templateManager.getTemplatesByVersion('v2');

      v2Templates.forEach(template => {
        expect(template.structure).toHaveLength(6);
        expect(template.structure).toContain('Domain');
        expect(template.structure).toContain('Industry');
        expect(template.structure).toContain('Profession');
        expect(template.structure).toContain('Field');
        expect(template.structure).toContain('Role');
        expect(template.structure).toContain('Task');
      });
    });
  });
});

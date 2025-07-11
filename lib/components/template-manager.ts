import { HierarchyTemplate } from './hierarchy-generator';
import v1Finance from "./templates/v1-finance.ts";
import v1Tech from "./templates/v1-tech.ts";
import v2Edu from "./templates/v2-edu.ts";
import v2Healthcare from "./templates/v2-healthcare.ts";
import v2Tech from "./templates/v2-tech.ts";

export interface DomainTemplate extends HierarchyTemplate {
  domain: string;
  commonSkills: string[];
  commonTools: string[];
  examples: string[];
}

export class TemplateManager {
  private templates: Map<string, DomainTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates() {
    // V2 Templates (6-layer hierarchy)
    this.addTemplate('technology-v2', v2Tech);
    this.addTemplate('healthcare-v2', v2Healthcare);
    this.addTemplate('education-v2', v2Edu);

    // V1 Templates (4-layer hierarchy)
    this.addTemplate('technology-v1', v1Tech);
    this.addTemplate('finance-v1', v1Finance);
  }

  addTemplate(key: string, template: DomainTemplate): void {
    this.templates.set(key, template);
  }

  getTemplate(key: string): DomainTemplate | undefined {
    return this.templates.get(key);
  }

  getTemplatesByVersion(version: 'v1' | 'v2'): DomainTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.version === version);
  }

  getTemplatesByDomain(domain: string): DomainTemplate[] {
    return Array.from(this.templates.values()).filter(t => 
      t.domain.toLowerCase().includes(domain.toLowerCase())
    );
  }

  getAllTemplates(): DomainTemplate[] {
    return Array.from(this.templates.values());
  }

  createCustomTemplate(
    key: string,
    domain: string,
    version: 'v1' | 'v2',
    options: Partial<DomainTemplate> = {}
  ): DomainTemplate {
    const structure = version === 'v1' 
      ? ['Domain', 'Specialization', 'Role', 'Responsibility']
      : ['Domain', 'Industry', 'Profession', 'Field', 'Role', 'Task'];

    const template: DomainTemplate = {
      version,
      domain,
      structure,
      description: `${domain} professional hierarchy`,
      commonSkills: [],
      commonTools: [],
      examples: [],
      ...options
    };

    this.addTemplate(key, template);
    return template;
  }
}

export default TemplateManager;
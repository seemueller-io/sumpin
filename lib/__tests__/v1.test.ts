import { expect, test, describe } from "bun:test";
import { ProfessionModel, Domain, Specialization, Role, Responsibility, Attribute } from "../v1.ts";

describe("V1 Professional Hierarchy Model", () => {
  describe("Attribute Model", () => {
    test("should create an attribute with required fields", () => {
      const attribute = Attribute.create({
        name: "JavaScript",
        type: "Skill"
      });

      expect(attribute.name).toBe("JavaScript");
      expect(attribute.type).toBe("Skill");
      expect(attribute.description).toBe("");
    });

    test("should create an attribute with description", () => {
      const attribute = Attribute.create({
        name: "React",
        type: "Tool",
        description: "Frontend library for building user interfaces"
      });

      expect(attribute.name).toBe("React");
      expect(attribute.type).toBe("Tool");
      expect(attribute.description).toBe("Frontend library for building user interfaces");
    });

    test("should accept all valid attribute types", () => {
      const skill = Attribute.create({ name: "Problem Solving", type: "Skill" });
      const tool = Attribute.create({ name: "VS Code", type: "Tool" });
      const trait = Attribute.create({ name: "Leadership", type: "Trait" });

      expect(skill.type).toBe("Skill");
      expect(tool.type).toBe("Tool");
      expect(trait.type).toBe("Trait");
    });
  });

  describe("Responsibility Model", () => {
    test("should create a responsibility with required attributes", () => {
      const jsAttribute = Attribute.create({ name: "JavaScript", type: "Skill" });
      const reactAttribute = Attribute.create({ name: "React", type: "Tool" });

      const responsibility = Responsibility.create({
        title: "Build User Interfaces",
        outcome: "Functional and responsive web applications",
        requiredAttributes: [jsAttribute, reactAttribute]
      });

      expect(responsibility.title).toBe("Build User Interfaces");
      expect(responsibility.outcome).toBe("Functional and responsive web applications");
      expect(responsibility.requiredAttributes).toHaveLength(2);
      expect(responsibility.requiredAttributes[0].name).toBe("JavaScript");
      expect(responsibility.requiredAttributes[1].name).toBe("React");
    });

    test("should create a responsibility with empty attributes array", () => {
      const responsibility = Responsibility.create({
        title: "Code Review",
        outcome: "High quality code",
        requiredAttributes: []
      });

      expect(responsibility.requiredAttributes).toHaveLength(0);
    });
  });

  describe("Role Model", () => {
    test("should create a role with all seniority levels", () => {
      const seniorityLevels = ["Intern", "Junior", "Mid", "Senior", "Lead", "Principal"];

      seniorityLevels.forEach(level => {
        const role = Role.create({
          title: `${level} Developer`,
          responsibilities: [],
          requiredAttributes: [],
          seniority: level as any
        });

        expect(role.seniority).toBe(level);
      });
    });

    test("should create a role with responsibilities and attributes", () => {
      const attributeForResponsibility = Attribute.create({ name: "TypeScript", type: "Skill" });
      const attributeForRole = Attribute.create({ name: "TypeScript", type: "Skill" });
      const responsibility = Responsibility.create({
        title: "Develop Features",
        outcome: "Working software features",
        requiredAttributes: [attributeForResponsibility]
      });

      const role = Role.create({
        title: "Frontend Developer",
        responsibilities: [responsibility],
        requiredAttributes: [attributeForRole],
        seniority: "Mid"
      });

      expect(role.title).toBe("Frontend Developer");
      expect(role.responsibilities).toHaveLength(1);
      expect(role.requiredAttributes).toHaveLength(1);
      expect(role.seniority).toBe("Mid");
    });
  });

  describe("Specialization Model", () => {
    test("should create a specialization with roles and attributes", () => {
      const coreAttribute = Attribute.create({ name: "Web Development", type: "Skill" });
      const role = Role.create({
        title: "Web Developer",
        responsibilities: [],
        requiredAttributes: [],
        seniority: "Mid"
      });

      const specialization = Specialization.create({
        name: "Frontend Development",
        focus: "User interface and experience",
        coreAttributes: [coreAttribute],
        roles: [role]
      });

      expect(specialization.name).toBe("Frontend Development");
      expect(specialization.focus).toBe("User interface and experience");
      expect(specialization.coreAttributes).toHaveLength(1);
      expect(specialization.roles).toHaveLength(1);
    });
  });

  describe("Domain Model", () => {
    test("should create a domain with specializations", () => {
      const attribute = Attribute.create({ name: "Programming", type: "Skill" });
      const specialization = Specialization.create({
        name: "Software Engineering",
        focus: "Building software systems",
        coreAttributes: [],
        roles: []
      });

      const domain = Domain.create({
        name: "Technology",
        description: "Technology and software development",
        specializations: [specialization],
        coreAttributes: [attribute]
      });

      expect(domain.name).toBe("Technology");
      expect(domain.description).toBe("Technology and software development");
      expect(domain.specializations).toHaveLength(1);
      expect(domain.coreAttributes).toHaveLength(1);
    });

    test("should create a domain with empty description", () => {
      const domain = Domain.create({
        name: "Engineering",
        specializations: [],
        coreAttributes: []
      });

      expect(domain.description).toBe("");
    });
  });

  describe("ProfessionModel", () => {
    test("should create a profession model with domains", () => {
      const domain = Domain.create({
        name: "Healthcare",
        specializations: [],
        coreAttributes: []
      });

      const professionModel = ProfessionModel.create({
        domains: [domain]
      });

      expect(professionModel.domains).toHaveLength(1);
      expect(professionModel.domains[0].name).toBe("Healthcare");
    });

    test("should create an empty profession model", () => {
      const professionModel = ProfessionModel.create({
        domains: []
      });

      expect(professionModel.domains).toHaveLength(0);
    });
  });

  describe("Complete Hierarchy Integration", () => {
    test("should create a complete professional hierarchy", () => {
      const jsSkillForResponsibility = Attribute.create({ name: "JavaScript", type: "Skill" });
      const reactToolForResponsibility = Attribute.create({ name: "React", type: "Tool" });

      // Create attributes for role
      const jsSkillForRole = Attribute.create({ name: "JavaScript", type: "Skill" });
      const reactToolForRole = Attribute.create({ name: "React", type: "Tool" });
      const leadershipTrait = Attribute.create({ name: "Leadership", type: "Trait" });

      const jsSkillForSpecialization = Attribute.create({ name: "JavaScript", type: "Skill" });
      const reactToolForSpecialization = Attribute.create({ name: "React", type: "Tool" });

      const jsSkillForDomain = Attribute.create({ name: "JavaScript", type: "Skill" });

      const responsibility = Responsibility.create({
        title: "Build React Applications",
        outcome: "Scalable web applications",
        requiredAttributes: [jsSkillForResponsibility, reactToolForResponsibility]
      });

      // Create role
      const role = Role.create({
        title: "Senior Frontend Developer",
        responsibilities: [responsibility],
        requiredAttributes: [jsSkillForRole, reactToolForRole, leadershipTrait],
        seniority: "Senior"
      });

      const specialization = Specialization.create({
        name: "Frontend Development",
        focus: "User interfaces and client-side applications",
        coreAttributes: [jsSkillForSpecialization, reactToolForSpecialization],
        roles: [role]
      });

      // Create domain
      const domain = Domain.create({
        name: "Software Engineering",
        description: "Building software systems and applications",
        specializations: [specialization],
        coreAttributes: [jsSkillForDomain]
      });

      const professionModel = ProfessionModel.create({
        domains: [domain]
      });

      // Verify the complete hierarchy
      expect(professionModel.domains).toHaveLength(1);
      expect(professionModel.domains[0].specializations).toHaveLength(1);
      expect(professionModel.domains[0].specializations[0].roles).toHaveLength(1);
      expect(professionModel.domains[0].specializations[0].roles[0].responsibilities).toHaveLength(1);

      const retrievedRole = professionModel.domains[0].specializations[0].roles[0];
      expect(retrievedRole.title).toBe("Senior Frontend Developer");
      expect(retrievedRole.seniority).toBe("Senior");
      expect(retrievedRole.responsibilities[0].title).toBe("Build React Applications");
      expect(retrievedRole.requiredAttributes).toHaveLength(3);
    });
  });
});

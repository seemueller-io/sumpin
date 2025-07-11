import { expect, test, describe, beforeEach } from "bun:test";
import { 
  TaskModel, 
  RoleModel, 
  FieldModel, 
  ProfessionModel, 
  IndustryModel, 
  DomainModel, 
  Enterprise,
  Task,
  Role,
  Field,
  Profession,
  Industry,
  Domain,
  IRootStore
} from "../v2.ts";

describe("V2 Professional Hierarchy Model", () => {
  describe("TaskModel", () => {
    test("should create a task with UUID identifier", () => {
      const task = TaskModel.create({
        name: "Design REST endpoints"
      });

      expect(task.name).toBe("Design REST endpoints");
      expect(task.id).toBeDefined();
      expect(typeof task.id).toBe("string");
      expect(task.id.length).toBeGreaterThan(0);
      expect(task.description).toBeUndefined();
    });

    test("should create a task with description", () => {
      const task = TaskModel.create({
        name: "Write unit tests",
        description: "Create comprehensive test coverage for new features"
      });

      expect(task.name).toBe("Write unit tests");
      expect(task.description).toBe("Create comprehensive test coverage for new features");
    });

    test("should update task properties", () => {
      const task = TaskModel.create({
        name: "Initial task"
      });

      task.update({
        name: "Updated task",
        description: "Updated description"
      });

      expect(task.name).toBe("Updated task");
      expect(task.description).toBe("Updated description");
    });

    test("should have unique IDs for different tasks", () => {
      const task1 = TaskModel.create({ name: "Task 1" });
      const task2 = TaskModel.create({ name: "Task 2" });

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe("RoleModel", () => {
    test("should create a role with tasks", () => {
      const role = RoleModel.create({
        title: "API Engineer",
        summary: "Designs and implements REST APIs"
      });

      expect(role.title).toBe("API Engineer");
      expect(role.summary).toBe("Designs and implements REST APIs");
      expect(role.tasks).toHaveLength(0);
      expect(role.id).toBeDefined();
    });

    test("should add and remove tasks", () => {
      const role = RoleModel.create({
        title: "Backend Developer"
      });

      role.addTask({ name: "Design database schema" });
      role.addTask({ name: "Implement API endpoints" });

      expect(role.tasks).toHaveLength(2);
      expect((role.tasks[0] as any).name).toBe("Design database schema");
      expect((role.tasks[1] as any).name ).toBe("Implement API endpoints");

      // Remove a task
      const taskToRemove = role.tasks[0];
      role.removeTask(taskToRemove);

      expect(role.tasks).toHaveLength(1);
      expect((role.tasks[0] as any).name).toBe("Implement API endpoints");
    });

    test("should return all tasks through view", () => {
      const role = RoleModel.create({
        title: "Frontend Developer"
      });

      role.addTask({ name: "Build components" });
      role.addTask({ name: "Write tests" });

      const allTasks = role.allTasks;
      expect(allTasks).toHaveLength(2);
      expect(allTasks[0].name).toBe("Build components");
      expect(allTasks[1].name).toBe("Write tests");
    });
  });

  describe("FieldModel", () => {
    test("should create a field with roles", () => {
      const field = FieldModel.create({
        name: "Backend Development",
        description: "Server-side application development"
      });

      expect(field.name).toBe("Backend Development");
      expect(field.description).toBe("Server-side application development");
      expect(field.roles).toHaveLength(0);
    });

    test("should add and remove roles", () => {
      const field = FieldModel.create({
        name: "Frontend Development"
      });

      field.addRole({ title: "React Developer" });
      field.addRole({ title: "Vue Developer" });

      expect(field.roles).toHaveLength(2);
      expect(field.roles[0].title).toBe("React Developer");
      expect(field.roles[1].title).toBe("Vue Developer");

      const roleToRemove = field.roles[0];
      field.removeRole(roleToRemove);

      expect(field.roles).toHaveLength(1);
      expect(field.roles[0].title).toBe("Vue Developer");
    });

    test("should return all tasks from nested roles", () => {
      const field = FieldModel.create({
        name: "Full Stack Development"
      });

      field.addRole({ title: "Frontend Developer" });
      field.addRole({ title: "Backend Developer" });

      // Add tasks to roles
      field.roles[0].addTask({ name: "Build UI components" });
      field.roles[0].addTask({ name: "Handle user interactions" });
      field.roles[1].addTask({ name: "Design APIs" });

      const allTasks = field.allTasks;
      expect(allTasks).toHaveLength(3);
      expect(allTasks.map(t => t.name)).toContain("Build UI components");
      expect(allTasks.map(t => t.name)).toContain("Handle user interactions");
      expect(allTasks.map(t => t.name)).toContain("Design APIs");
    });
  });

  describe("ProfessionModel", () => {
    test("should create a profession with fields", () => {
      const profession = ProfessionModel.create({
        name: "Software Engineering",
        description: "Building software systems and applications"
      });

      expect(profession.name).toBe("Software Engineering");
      expect(profession.description).toBe("Building software systems and applications");
      expect(profession.fields).toHaveLength(0);
    });

    test("should add and remove fields", () => {
      const profession = ProfessionModel.create({
        name: "Web Development"
      });

      profession.addField({ name: "Frontend" });
      profession.addField({ name: "Backend" });

      expect(profession.fields).toHaveLength(2);
      expect(profession.fields[0].name).toBe("Frontend");
      expect(profession.fields[1].name).toBe("Backend");

      const fieldToRemove = profession.fields[0];
      profession.removeField(fieldToRemove);

      expect(profession.fields).toHaveLength(1);
      expect(profession.fields[0].name).toBe("Backend");
    });

    test("should return all tasks from nested hierarchy", () => {
      const profession = ProfessionModel.create({
        name: "Software Engineering"
      });

      profession.addField({ name: "Backend" });
      profession.fields[0].addRole({ title: "API Developer" });
      profession.fields[0].roles[0].addTask({ name: "Design REST endpoints" });
      profession.fields[0].roles[0].addTask({ name: "Implement authentication" });

      const allTasks = profession.allTasks;
      expect(allTasks).toHaveLength(2);
      expect(allTasks.map(t => t.name)).toContain("Design REST endpoints");
      expect(allTasks.map(t => t.name)).toContain("Implement authentication");
    });
  });

  describe("IndustryModel", () => {
    test("should create an industry with professions", () => {
      const industry = IndustryModel.create({
        name: "Software",
        description: "Software development and technology"
      });

      expect(industry.name).toBe("Software");
      expect(industry.description).toBe("Software development and technology");
      expect(industry.professions).toHaveLength(0);
    });

    test("should add and remove professions", () => {
      const industry = IndustryModel.create({
        name: "Technology"
      });

      industry.addProfession({ name: "Software Engineering" });
      industry.addProfession({ name: "Data Science" });

      expect(industry.professions).toHaveLength(2);
      expect(industry.professions[0].name).toBe("Software Engineering");
      expect(industry.professions[1].name).toBe("Data Science");

      // Remove a profession
      const professionToRemove = industry.professions[0];
      industry.removeProfession(professionToRemove);

      expect(industry.professions).toHaveLength(1);
      expect(industry.professions[0].name).toBe("Data Science");
    });

    test("should return all tasks from nested hierarchy", () => {
      const industry = IndustryModel.create({
        name: "Software"
      });

      industry.addProfession({ name: "Web Development" });
      industry.professions[0].addField({ name: "Frontend" });
      industry.professions[0].fields[0].addRole({ title: "React Developer" });
      industry.professions[0].fields[0].roles[0].addTask({ name: "Build components" });
      industry.professions[0].fields[0].roles[0].addTask({ name: "Manage state" });

      const allTasks = industry.allTasks;
      expect(allTasks).toHaveLength(2);
      expect(allTasks.map(t => t.name)).toContain("Build components");
      expect(allTasks.map(t => t.name)).toContain("Manage state");
    });
  });

  describe("DomainModel", () => {
    test("should create a domain with industries", () => {
      const domain = DomainModel.create({
        name: "STEM",
        description: "Science, Technology, Engineering, and Mathematics"
      });

      expect(domain.name).toBe("STEM");
      expect(domain.description).toBe("Science, Technology, Engineering, and Mathematics");
      expect(domain.industries).toHaveLength(0);
    });

    test("should add and remove industries", () => {
      const domain = DomainModel.create({
        name: "Technology"
      });

      domain.addIndustry({ name: "Software" });
      domain.addIndustry({ name: "Hardware" });

      expect(domain.industries).toHaveLength(2);
      expect(domain.industries[0].name).toBe("Software");
      expect(domain.industries[1].name).toBe("Hardware");

      const industryToRemove = domain.industries[0];
      domain.removeIndustry(industryToRemove);

      expect(domain.industries).toHaveLength(1);
      expect(domain.industries[0].name).toBe("Hardware");
    });

    test("should return all tasks from nested hierarchy", () => {
      const domain = DomainModel.create({
        name: "STEM"
      });

      domain.addIndustry({ name: "Software" });
      domain.industries[0].addProfession({ name: "Software Engineering" });
      domain.industries[0].professions[0].addField({ name: "Backend" });
      domain.industries[0].professions[0].fields[0].addRole({ title: "API Engineer" });
      domain.industries[0].professions[0].fields[0].roles[0].addTask({ name: "Design REST endpoints" });

      const allTasks = domain.allTasks;
      expect(allTasks).toHaveLength(1);
      expect(allTasks[0].name).toBe("Design REST endpoints");
    });
  });

  describe("Enterprise", () => {
    let store: IRootStore;

    beforeEach(() => {
      store = Enterprise.create({});
    });

    test("should create an empty root store", () => {
      expect(store.domains).toHaveLength(0);
    });

    test("should add domains", () => {
      store.addDomain({ name: "STEM" });
      store.addDomain({ name: "Arts" });

      expect(store.domains).toHaveLength(2);
      expect(store.domains[0].name).toBe("STEM");
      expect(store.domains[1].name).toBe("Arts");
    });

    test("should return all tasks from entire hierarchy", () => {
      store.addDomain({ name: "STEM" });
      store.domains[0].addIndustry({ name: "Software" });
      store.domains[0].industries[0].addProfession({ name: "Software Engineering" });
      store.domains[0].industries[0].professions[0].addField({ name: "Backend" });
      store.domains[0].industries[0].professions[0].fields[0].addRole({ title: "API Engineer" });
      store.domains[0].industries[0].professions[0].fields[0].roles[0].addTask({ name: "Design REST endpoints" });
      store.domains[0].industries[0].professions[0].fields[0].roles[0].addTask({ name: "Implement authentication" });

      const allTasks = store.allTasks;
      expect(allTasks).toHaveLength(2);
      expect(allTasks.map(t => t.name)).toContain("Design REST endpoints");
      expect(allTasks.map(t => t.name)).toContain("Implement authentication");
    });
  });

  describe("Complete Hierarchy Integration", () => {
    test("should create and manipulate a complete 6-layer hierarchy", () => {
      const store = Enterprise.create({});

      // Build the complete hierarchy as shown in the example
      store.addDomain({ name: "STEM" });
      store.domains[0].addIndustry({ name: "Software" });
      store.domains[0].industries[0].addProfession({ name: "Software Engineering" });
      store.domains[0].industries[0].professions[0].addField({ name: "Backend" });
      store.domains[0].industries[0].professions[0].fields[0].addRole({ title: "API Engineer" });
      store.domains[0].industries[0].professions[0].fields[0].roles[0].addTask({ name: "Design REST endpoints" });

      expect(store.domains).toHaveLength(1);
      expect(store.domains[0].industries).toHaveLength(1);
      expect(store.domains[0].industries[0].professions).toHaveLength(1);
      expect(store.domains[0].industries[0].professions[0].fields).toHaveLength(1);
      expect(store.domains[0].industries[0].professions[0].fields[0].roles).toHaveLength(1);
      expect(store.domains[0].industries[0].professions[0].fields[0].roles[0].tasks).toHaveLength(1);

      // Verify data integrity through the hierarchy
      const task = store.domains[0].industries[0].professions[0].fields[0].roles[0].tasks[0];
      expect(task.name).toBe("Design REST endpoints");

      expect(store.allTasks).toHaveLength(1);
      expect(store.domains[0].allTasks).toHaveLength(1);
      expect(store.domains[0].industries[0].allTasks).toHaveLength(1);
      expect(store.domains[0].industries[0].professions[0].allTasks).toHaveLength(1);
      expect(store.domains[0].industries[0].professions[0].fields[0].allTasks).toHaveLength(1);

      // Add more tasks and verify aggregation
      store.domains[0].industries[0].professions[0].fields[0].roles[0].addTask({ name: "Implement authentication" });
      store.domains[0].industries[0].professions[0].fields[0].addRole({ title: "Database Engineer" });
      store.domains[0].industries[0].professions[0].fields[0].roles[1].addTask({ name: "Design database schema" });

      expect(store.allTasks).toHaveLength(3);
      expect(store.domains[0].industries[0].professions[0].fields[0].allTasks).toHaveLength(3);
    });

    test("should handle multiple parallel hierarchies", () => {
      const store = Enterprise.create({});

      store.addDomain({ name: "STEM" });
      store.domains[0].addIndustry({ name: "Software" });
      store.domains[0].industries[0].addProfession({ name: "Web Development" });
      store.domains[0].industries[0].professions[0].addField({ name: "Frontend" });
      store.domains[0].industries[0].professions[0].fields[0].addRole({ title: "React Developer" });
      store.domains[0].industries[0].professions[0].fields[0].roles[0].addTask({ name: "Build components" });

      // Create second hierarchy branch
      store.addDomain({ name: "Arts" });
      store.domains[1].addIndustry({ name: "Digital Media" });
      store.domains[1].industries[0].addProfession({ name: "Graphic Design" });
      store.domains[1].industries[0].professions[0].addField({ name: "Web Design" });
      store.domains[1].industries[0].professions[0].fields[0].addRole({ title: "UI Designer" });
      store.domains[1].industries[0].professions[0].fields[0].roles[0].addTask({ name: "Create mockups" });

      expect(store.domains).toHaveLength(2);
      expect(store.allTasks).toHaveLength(2);
      expect(store.allTasks.map(t => t.name)).toContain("Build components");
      expect(store.allTasks.map(t => t.name)).toContain("Create mockups");

      // Verify each domain has its own tasks
      expect(store.domains[0].allTasks).toHaveLength(1);
      expect(store.domains[1].allTasks).toHaveLength(1);
      expect(store.domains[0].allTasks[0].name).toBe("Build components");
      expect(store.domains[1].allTasks[0].name).toBe("Create mockups");
    });
  });

  describe("CRUD Operations", () => {
    test("should support task updates and removal", () => {
      const role = RoleModel.create({ title: "Developer" });
      role.addTask({ name: "Initial task", description: "Initial description" });

      const task = role.tasks[0];
      const originalId = task.id;

      task.update({ name: "Updated task", description: "Updated description" });
      expect(task.name).toBe("Updated task");
      expect(task.description).toBe("Updated description");
      expect(task.id).toBe(originalId); // ID should remain the same

      // Remove task through parent
      expect(role.tasks).toHaveLength(1);
      role.removeTask(task);
      expect(role.tasks).toHaveLength(0);
    });

    test("should support role removal", () => {
      const field = FieldModel.create({ name: "Development" });
      field.addRole({ title: "Developer" });

      expect(field.roles).toHaveLength(1);
      const role = field.roles[0];
      field.removeRole(role);
      expect(field.roles).toHaveLength(0);
    });

    test("should support field removal", () => {
      const profession = ProfessionModel.create({ name: "Engineering" });
      profession.addField({ name: "Software" });

      expect(profession.fields).toHaveLength(1);
      const field = profession.fields[0];
      profession.removeField(field);
      expect(profession.fields).toHaveLength(0);
    });

    test("should support profession removal", () => {
      const industry = IndustryModel.create({ name: "Tech" });
      industry.addProfession({ name: "Software Engineering" });

      expect(industry.professions).toHaveLength(1);
      const profession = industry.professions[0];
      industry.removeProfession(profession);
      expect(industry.professions).toHaveLength(0);
    });

    test("should support industry removal", () => {
      const domain = DomainModel.create({ name: "STEM" });
      domain.addIndustry({ name: "Software" });

      expect(domain.industries).toHaveLength(1);
      const industry = domain.industries[0];
      domain.removeIndustry(industry);
      expect(domain.industries).toHaveLength(0);
    });

  });
});

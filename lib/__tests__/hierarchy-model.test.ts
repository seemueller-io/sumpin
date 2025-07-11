import { expect, test, describe } from "bun:test";
import { HierarchyModel, HierarchyStore } from "../hierarchy-model";

describe("HierarchyModel", () => {
  test("should create a hierarchy model with all required fields", () => {
    const hierarchyData = {
      version: "v1",
      domain: "Technology",
      structure: ["Domain", "Specialization", "Role", "Responsibility"],
      description: "A technology hierarchy for software development",
      commonSkills: ["Programming", "Problem Solving", "Communication"],
      commonTools: ["IDE", "Git", "Testing Frameworks"],
      examples: ["Web Development", "Mobile Development", "DevOps"]
    };

    const hierarchy = HierarchyModel.create(hierarchyData);

    expect(hierarchy.version).toBe("v1");
    expect(hierarchy.domain).toBe("Technology");
    expect(hierarchy.structure).toEqual(["Domain", "Specialization", "Role", "Responsibility"]);
    expect(hierarchy.description).toBe("A technology hierarchy for software development");
    expect(hierarchy.commonSkills).toEqual(["Programming", "Problem Solving", "Communication"]);
    expect(hierarchy.commonTools).toEqual(["IDE", "Git", "Testing Frameworks"]);
    expect(hierarchy.examples).toEqual(["Web Development", "Mobile Development", "DevOps"]);
  });

  test("should create a v2 hierarchy model", () => {
    const hierarchyData = {
      version: "v2",
      domain: "Healthcare",
      structure: ["Domain", "Industry", "Profession", "Field", "Role", "Task"],
      description: "A healthcare hierarchy for medical services",
      commonSkills: ["Patient Care", "Medical Knowledge", "Communication"],
      commonTools: ["EMR Systems", "Medical Devices", "Diagnostic Tools"],
      examples: ["Emergency Medicine", "Primary Care", "Specialized Surgery"]
    };

    const hierarchy = HierarchyModel.create(hierarchyData);

    expect(hierarchy.version).toBe("v2");
    expect(hierarchy.domain).toBe("Healthcare");
    expect(hierarchy.structure).toHaveLength(6);
  });

  test("should handle empty arrays for optional fields", () => {
    const hierarchyData = {
      version: "v1",
      domain: "Finance",
      structure: ["Domain", "Specialization", "Role", "Responsibility"],
      description: "A finance hierarchy",
      commonSkills: [],
      commonTools: [],
      examples: []
    };

    const hierarchy = HierarchyModel.create(hierarchyData);

    expect(hierarchy.commonSkills).toEqual([]);
    expect(hierarchy.commonTools).toEqual([]);
    expect(hierarchy.examples).toEqual([]);
  });
});

describe("HierarchyStore", () => {
  test("should create an empty hierarchy store", () => {
    const store = HierarchyStore.create({
      items: {}
    });

    expect(store.items.size).toBe(0);
  });

  test("should add hierarchy to store", () => {
    const store = HierarchyStore.create({
      items: {}
    });

    const hierarchyData = {
      version: "v1",
      domain: "Technology",
      structure: ["Domain", "Specialization", "Role", "Responsibility"],
      description: "A technology hierarchy",
      commonSkills: ["Programming"],
      commonTools: ["IDE"],
      examples: ["Web Development"]
    };

    const hierarchy = HierarchyModel.create(hierarchyData);
    store.add(hierarchy);

    expect(store.items.size).toBe(1);
    expect(store.items.get("Technology")).toBe(hierarchy);
  });

  test("should add multiple hierarchies to store", () => {
    const store = HierarchyStore.create({
      items: {}
    });

    const techHierarchy = HierarchyModel.create({
      version: "v1",
      domain: "Technology",
      structure: ["Domain", "Specialization", "Role", "Responsibility"],
      description: "A technology hierarchy",
      commonSkills: ["Programming"],
      commonTools: ["IDE"],
      examples: ["Web Development"]
    });

    const financeHierarchy = HierarchyModel.create({
      version: "v2",
      domain: "Finance",
      structure: ["Domain", "Industry", "Profession", "Field", "Role", "Task"],
      description: "A finance hierarchy",
      commonSkills: ["Analysis"],
      commonTools: ["Excel"],
      examples: ["Investment Banking"]
    });

    store.add(techHierarchy);
    store.add(financeHierarchy);

    expect(store.items.size).toBe(2);
    expect(store.items.get("Technology")).toBe(techHierarchy);
    expect(store.items.get("Finance")).toBe(financeHierarchy);
  });

  test("should overwrite hierarchy with same domain", () => {
    const store = HierarchyStore.create({
      items: {}
    });

    const hierarchy1 = HierarchyModel.create({
      version: "v1",
      domain: "Technology",
      structure: ["Domain", "Specialization", "Role", "Responsibility"],
      description: "First tech hierarchy",
      commonSkills: ["Programming"],
      commonTools: ["IDE"],
      examples: ["Web Development"]
    });

    const hierarchy2 = HierarchyModel.create({
      version: "v2",
      domain: "Technology",
      structure: ["Domain", "Industry", "Profession", "Field", "Role", "Task"],
      description: "Second tech hierarchy",
      commonSkills: ["Advanced Programming"],
      commonTools: ["Advanced IDE"],
      examples: ["AI Development"]
    });

    store.add(hierarchy1);
    expect(store.items.size).toBe(1);
    expect(store.items.get("Technology")?.description).toBe("First tech hierarchy");

    store.add(hierarchy2);
    expect(store.items.size).toBe(1);
    expect(store.items.get("Technology")?.description).toBe("Second tech hierarchy");
    expect(store.items.get("Technology")?.version).toBe("v2");
  });
});
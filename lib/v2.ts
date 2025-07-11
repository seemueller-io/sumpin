// Profession Hierarchy Model using mobx-state-tree (MST)
// -----------------------------------------------------
// This file defines a generic, extensible hierarchy that captures the essence
// of professions. It intentionally separates concerns across six conceptual
// layers, from the broad Domain level down to atomic Tasks. Each layer owns
// its children through strongly‑typed arrays, enabling fine‑grained reactivity,
// traversal, and manipulation.
//
// Layering
// ┌ Domain        – e.g. "STEM", "Arts", "Public Service"
// │ └ Industry    – e.g. "Software", "Healthcare", "Finance"
// │   └ Profession – e.g. "Software Engineering", "Nursing"
// │     └ Field    – e.g. "Backend", "Pediatrics"
// │       └ Role   – e.g. "API Engineer", "Pediatric Nurse"
// │         └ Task – e.g. "Design REST endpoints", "Administer vaccine"
//
// Each model exposes actions to mutate its children as well as compositional
// views to rapidly surface nested information (e.g., all tasks under an
// Industry). Identifiers are UUID‑v4 strings to guarantee uniqueness across
// distributed systems.
// -----------------------------------------------------

import { types, Instance, SnapshotIn, getParent, destroy } from "mobx-state-tree";
import { v4 as uuidv4 } from "uuid";

/* Utility --------------------------------------------------------------- */
const withId = <T extends Record<string, unknown>>(modelName: string, definition: T) =>
    types.model(modelName, {
        id: types.optional(types.identifier, uuidv4),
        ...definition
    });

/* Task ------------------------------------------------------------------ */
export const TaskModel = withId("Task", {
    name: types.string,
    description: types.maybe(types.string)
})
    .actions(self => ({
        update(attrs: Partial<SnapshotIn<typeof TaskModel>>) {
            Object.assign(self, attrs);
        },
        remove() {
            destroy(self);
        }
    }));
export interface Task extends Instance<typeof TaskModel> {}

/* Role ------------------------------------------------------------------ */
export const RoleModel = withId("Role", {
    title: types.string,
    summary: types.maybe(types.string),
    tasks: types.optional(types.array(TaskModel), [])
})
    .actions(self => ({
        addTask(task: SnapshotIn<typeof TaskModel>) {
            self.tasks.push(TaskModel.create(task));
        },
        removeTask(task: Task) {
            self.tasks.remove(task);
        },
        remove() {
            destroy(self);
        }
    }))
    .views(self => ({
        get allTasks() {
            return self.tasks.slice();
        }
    }));
export interface Role extends Instance<typeof RoleModel> {}

/* Field (Specialization) ------------------------------------------------- */
export const FieldModel = withId("Field", {
    name: types.string,
    description: types.maybe(types.string),
    roles: types.optional(types.array(RoleModel), [])
})
    .actions(self => ({
        addRole(role: SnapshotIn<typeof RoleModel>) {
            self.roles.push(RoleModel.create(role));
        },
        removeRole(role: Role) {
            self.roles.remove(role);
        },
        remove() {
            destroy(self);
        }
    }))
    .views(self => ({
        get allTasks() {
            return self.roles.flatMap(r => r.allTasks);
        }
    }));
export interface Field extends Instance<typeof FieldModel> {}

/* Profession ------------------------------------------------------------ */
export const ProfessionModel = withId("Profession", {
    name: types.string,
    description: types.maybe(types.string),
    fields: types.optional(types.array(FieldModel), [])
})
    .actions(self => ({
        addField(field: SnapshotIn<typeof FieldModel>) {
            self.fields.push(FieldModel.create(field));
        },
        removeField(field: Field) {
            self.fields.remove(field);
        },
        remove() {
            destroy(self);
        }
    }))
    .views(self => ({
        get allTasks() {
            return self.fields.flatMap(f => f.allTasks);
        }
    }));
export interface Profession extends Instance<typeof ProfessionModel> {}

/* Industry -------------------------------------------------------------- */
export const IndustryModel = withId("Industry", {
    name: types.string,
    description: types.maybe(types.string),
    professions: types.optional(types.array(ProfessionModel), [])
})
    .actions(self => ({
        addProfession(prof: SnapshotIn<typeof ProfessionModel>) {
            self.professions.push(ProfessionModel.create(prof));
        },
        removeProfession(prof: Profession) {
            self.professions.remove(prof);
        },
        remove() {
            destroy(self);
        }
    }))
    .views(self => ({
        get allTasks() {
            return self.professions.flatMap(p => p.allTasks);
        }
    }));
export interface Industry extends Instance<typeof IndustryModel> {}

/* Domain ---------------------------------------------------------------- */
export const DomainModel = withId("Domain", {
    name: types.string,
    description: types.maybe(types.string),
    industries: types.optional(types.array(IndustryModel), [])
})
    .actions(self => ({
        addIndustry(ind: SnapshotIn<typeof IndustryModel>) {
            self.industries.push(IndustryModel.create(ind));
        },
        removeIndustry(ind: Industry) {
            self.industries.remove(ind);
        },
        remove() {
            destroy(self);
        }
    }))
    .views(self => ({
        get allTasks() {
            return self.industries.flatMap(i => i.allTasks);
        }
    }));
export interface Domain extends Instance<typeof DomainModel> {}

/* Enterprise ------------------------------------------------------------- */
export const Enterprise = types
    .model("Enterprise", {
        domains: types.optional(types.array(DomainModel), [])
    })
    .actions(self => ({
        addDomain(domain: SnapshotIn<typeof DomainModel>) {
            self.domains.push(DomainModel.create(domain));
        }
    }))
    .views(self => ({
        // Convenience: get a flat list of everything
        get allTasks() {
            return self.domains.flatMap(d => d.allTasks);
        }
    }));
export interface IRootStore extends Instance<typeof Enterprise> {}

/* Example usage --------------------------------------------------------- */
// const store = Enterprise.create({});
// store.addDomain({ name: "STEM" });
// store.domains[0].addIndustry({ name: "Software" });
// store.domains[0].industries[0].addProfession({ name: "Software Engineering" });
// store.domains[0].industries[0].professions[0].addField({ name: "Backend" });
// store.domains[0].industries[0].professions[0].fields[0].addRole({ title: "API Engineer" });
// store.domains[0].industries[0].professions[0].fields[0].roles[0].addTask({ name: "Design REST endpoints" });
// console.log(store.allTasks.map(t => t.name)); // → ["Design REST endpoints"]

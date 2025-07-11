import { types } from "mobx-state-tree";

/**
 * Reusable abstraction for a domain/sector hierarchy.
 * Works for both v1 and v2
 */
export const HierarchyModel = types.model("HierarchyModel", {
    version: types.string,                 // "v1" | "v2"
    domain: types.string,                  // e.g. "Finance", "Technology"
    structure: types.array(types.string),  // ordered hierarchy labels
    description: types.string,             // plain-text description
    commonSkills: types.array(types.string),
    commonTools: types.array(types.string),
    examples: types.array(types.string)
});

/* ------------------------------------------------------------------ *
 * Example usage
 * ------------------------------------------------------------------ */

// Create individual instances
// import { HierarchyModel } from "./hierarchy-model";
//
// const finance = HierarchyModel.create(v1Finance);
// const tech = HierarchyModel.create(v2Tech);

export const HierarchyStore = types
    .model("HierarchyStore", {
        items: types.map(HierarchyModel)     // keyed by domain name
    })
    .actions(self => ({
        add(h: Instance<typeof HierarchyModel>) {
            self.items.set(h.domain, h);
        }
    }));
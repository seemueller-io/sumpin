import { types } from "mobx-state-tree"

const Attribute = types.model("Attribute", {
    name: types.string,
    type: types.enumeration("AttributeType", ["Skill", "Tool", "Trait"]),
    description: types.optional(types.string, "")
})

const Responsibility = types.model("Responsibility", {
    title: types.string,
    outcome: types.string,
    requiredAttributes: types.array(Attribute)
})

const Role = types.model("Role", {
    title: types.string,
    responsibilities: types.array(Responsibility),
    requiredAttributes: types.array(Attribute),
    seniority: types.enumeration("Seniority", ["Intern", "Junior", "Mid", "Senior", "Lead", "Principal"])
})

// Specialization within a domain (e.g., cardiologist within medicine)
const Specialization = types.model("Specialization", {
    name: types.string,
    focus: types.string,
    coreAttributes: types.array(Attribute),
    roles: types.array(Role)
})

const Domain = types.model("Domain", {
    name: types.string,
    description: types.optional(types.string, ""),
    specializations: types.array(Specialization),
    coreAttributes: types.array(Attribute)
})

const ProfessionModel = types.model("ProfessionModel", {
    domains: types.array(Domain)
});

export { ProfessionModel, Domain, Specialization, Role, Responsibility, Attribute }

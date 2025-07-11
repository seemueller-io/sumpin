/**
 * finance Professional Hierarchy Example
 * Generated using OpenAI Agents SDK and Sumpin Professional Hierarchy Models
 * Model Version: v2 (6-layer hierarchy)
 * Generated on: 2025-07-11T20:02:03.514Z
 */

import { 
  Enterprise,
  DomainModel, IndustryModel, ProfessionModel, FieldModel, RoleModel, TaskModel
} from "../../lib/v2";

import { Enterprise, DomainModel, IndustryModel, ProfessionModel, FieldModel, RoleModel, TaskModel } from "../../lib/v2";

const financeDomain = new DomainModel({
    name: "Finance",
    industries: [
        new IndustryModel({
            name: "Investment Banking",
            professions: [
                new ProfessionModel({
                    name: "Investment Banker",
                    fields: [
                        new FieldModel({
                            name: "Corporate Finance",
                            roles: [
                                new RoleModel({
                                    name: "Analyst",
                                    tasks: [
                                        new TaskModel({
                                            name: "Financial Modeling",
                                            skills: ["Excel", "Financial Analysis"],
                                            tools: ["Excel", "Bloomberg Terminal"],
                                            example: "Building a discounted cash flow model for a merger."
                                        }),
                                        new TaskModel({
                                            name: "Market Research",
                                            skills: ["Data Analysis", "Presentation Skills"],
                                            tools: ["PitchBook", "Excel"],
                                            example: "Analyzing competitor performance for a potential acquisition."
                                        })
                                    ]
                                }),
                                new RoleModel({
                                    name: "Associate",
                                    tasks: [
                                        new TaskModel({
                                            name: "Deal Execution",
                                            skills: ["Negotiation", "Project Management"],
                                            tools: ["MS Project", "Deal Management Software"],
                                            example: "Leading a team to close a multi-million dollar equity issuance."
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    ]
});

// Basic operations
const readRoleTasks = (roleName: string) => {
    const role = financeDomain.industries[0].professions[0].fields[0].roles.find(r => r.name === roleName);
    return role ? role.tasks : [];
};

const updateTaskSkill = (roleName: string, taskName: string, newSkills: string[]) => {
    const role = financeDomain.industries[0].professions[0].fields[0].roles.find(r => r.name === roleName);
    const task = role?.tasks.find(t => t.name === taskName);
    if (task) {
        task.skills = newSkills;
    }
};

// Example usages
const analystTasks = readRoleTasks("Analyst");
updateTaskSkill("Analyst", "Financial Modeling", ["Advanced Excel", "Financial Forecasting"]);
/**
 * healthcare Professional Hierarchy Example
 * Generated using OpenAI Agents SDK and Sumpin Professional Hierarchy Models
 * Model Version: v2 (6-layer hierarchy)
 * Generated on: 2025-07-11T20:01:29.107Z
 */

import { 
  Enterprise,
  DomainModel, IndustryModel, ProfessionModel, FieldModel, RoleModel, TaskModel
} from "../../lib/v2";

import { Enterprise, DomainModel, IndustryModel, ProfessionModel, FieldModel, RoleModel, TaskModel } from "../../lib/v2";
const healthcareDomain = new DomainModel({
    name: "Healthcare",
    industries: [
        new IndustryModel({
            name: "Medical Services",
            professions: [
                new ProfessionModel({
                    name: "Nursing",
                    fields: [
                        new FieldModel({
                            name: "Clinical Nursing",
                            roles: [
                                new RoleModel({
                                    name: "Registered Nurse",
                                    competencies: [
                                        "Patient assessment",
                                        "Medication administration",
                                        "Care planning"
                                    ],
                                    tools: [
                                        "Electronic Health Records (EHR)",
                                        "Vital signs monitors",
                                        "Infusion pumps"
                                    ],
                                    tasks: [
                                        new TaskModel({
                                            name: "Patient Monitoring",
                                            description: "Monitoring patient vitals and documenting changes.",
                                            examples: [
                                                "Using EHR to log vital signs every hour.",
                                                "Adjusting care plan based on patient observations."
                                            ]
                                        }),
                                        new TaskModel({
                                            name: "Medication Management",
                                            description: "Administering and managing patient medications.",
                                            examples: [
                                                "Preparing and administering IV medications.",
                                                "Educating patients on prescribed medications."
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        new FieldModel({
                            name: "Nurse Practitioner",
                            roles: [
                                new RoleModel({
                                    name: "Family Nurse Practitioner",
                                    competencies: [
                                        "Advanced patient assessment",
                                        "Diagnosis and treatment planning",
                                        "Patient education"
                                    ],
                                    tools: [
                                        "Diagnostic tools (stethoscope, otoscope)",
                                        "Telehealth platform",
                                        "Prescription software"
                                    ],
                                    tasks: [
                                        new TaskModel({
                                            name: "Conducting Physical Exams",
                                            description: "Performing comprehensive assessments for patients.",
                                            examples: [
                                                "Utilizing telehealth for remote consultations.",
                                                "Documenting findings and recommending treatments."
                                            ]
                                        }),
                                        new TaskModel({
                                            name: "Health Promotion",
                                            description: "Educating families about preventive care.",
                                            examples: [
                                                "Organizing community health seminars.",
                                                "Providing personalized health advice to families."
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                new ProfessionModel({
                    name: "Healthcare Administration",
                    fields: [
                        new FieldModel({
                            name: "Hospital Administration",
                            roles: [
                                new RoleModel({
                                    name: "Healthcare Administrator",
                                    competencies: [
                                        "Operations management",
                                        "Compliance and regulations",
                                        "Financial planning"
                                    ],
                                    tools: [
                                        "Healthcare management software",
                                        "Data analytics tools",
                                        "Budgeting tools"
                                    ],
                                    tasks: [
                                        new TaskModel({
                                            name: "Budgeting and Financial Oversight",
                                            description: "Managing hospital budgets and financial resources.",
                                            examples: [
                                                "Creating annual budgets based on service demand.",
                                                "Reviewing financial performance reports."
                                            ]
                                        }),
                                        new TaskModel({
                                            name: "Quality Improvement Initiatives",
                                            description: "Implementing strategies to improve healthcare delivery.",
                                            examples: [
                                                "Conducting patient satisfaction surveys.",
                                                "Analyzing workflow for efficiency."
                                            ]
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
export default healthcareDomain;
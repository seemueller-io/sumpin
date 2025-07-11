import { ProfessionModel, Domain, Specialization, Role, Responsibility, Attribute } from "../../lib/v1";

console.log("=== Healthcare Professional Hierarchy Example (V1) ===\n");

const professionModel = ProfessionModel.create({
  domains: []
});

// Create the Healthcare domain
const healthcareDomain = Domain.create({
  name: "Healthcare",
  description: "Medical and health services domain",
  specializations: [],
  coreAttributes: [
    {
      name: "Medical Ethics",
      type: "Trait",
      description: "Understanding of medical ethics and patient care principles"
    },
    {
      name: "Communication",
      type: "Skill",
      description: "Effective communication with patients and colleagues"
    },
    {
      name: "Electronic Health Records",
      type: "Tool",
      description: "Proficiency with EHR systems"
    }
  ]
});

// Add specializations to Healthcare domain
const cardiology = Specialization.create({
  name: "Cardiology",
  focus: "Heart and cardiovascular system disorders",
  coreAttributes: [
    {
      name: "Cardiac Catheterization",
      type: "Skill",
      description: "Performing cardiac catheterization procedures"
    },
    {
      name: "ECG Interpretation",
      type: "Skill", 
      description: "Reading and interpreting electrocardiograms"
    },
    {
      name: "Echocardiogram Machine",
      type: "Tool",
      description: "Operating echocardiogram equipment"
    }
  ],
  roles: []
});

const pediatrics = Specialization.create({
  name: "Pediatrics",
  focus: "Medical care of infants, children, and adolescents",
  coreAttributes: [
    {
      name: "Child Psychology",
      type: "Skill",
      description: "Understanding child development and psychology"
    },
    {
      name: "Vaccination Protocols",
      type: "Skill",
      description: "Knowledge of pediatric vaccination schedules"
    },
    {
      name: "Pediatric Stethoscope",
      type: "Tool",
      description: "Specialized stethoscope for children"
    }
  ],
  roles: []
});

// Create roles for Cardiology
const cardiologist = Role.create({
  title: "Cardiologist",
  seniority: "Senior",
  responsibilities: [],
  requiredAttributes: [
    {
      name: "Board Certification",
      type: "Trait",
      description: "Board certified in cardiology"
    },
    {
      name: "Surgical Skills",
      type: "Skill",
      description: "Advanced surgical techniques for cardiac procedures"
    }
  ]
});

const cardiacNurse = Role.create({
  title: "Cardiac Nurse",
  seniority: "Mid",
  responsibilities: [],
  requiredAttributes: [
    {
      name: "Critical Care Experience",
      type: "Trait",
      description: "Experience in critical care environments"
    },
    {
      name: "Medication Administration",
      type: "Skill",
      description: "Safe administration of cardiac medications"
    }
  ]
});

// Create responsibilities for Cardiologist
const diagnosisResponsibility = Responsibility.create({
  title: "Cardiac Diagnosis",
  outcome: "Accurate diagnosis of cardiovascular conditions",
  requiredAttributes: [
    {
      name: "Diagnostic Imaging",
      type: "Skill",
      description: "Interpreting cardiac imaging studies"
    },
    {
      name: "Clinical Assessment",
      type: "Skill",
      description: "Comprehensive cardiovascular examination"
    }
  ]
});

const treatmentPlanningResponsibility = Responsibility.create({
  title: "Treatment Planning",
  outcome: "Comprehensive treatment plans for cardiac patients",
  requiredAttributes: [
    {
      name: "Evidence-Based Medicine",
      type: "Skill",
      description: "Applying current research to treatment decisions"
    },
    {
      name: "Risk Assessment",
      type: "Skill",
      description: "Evaluating patient risk factors"
    }
  ]
});

// Create responsibilities for Cardiac Nurse
const patientMonitoringResponsibility = Responsibility.create({
  title: "Patient Monitoring",
  outcome: "Continuous monitoring of cardiac patients' vital signs and condition",
  requiredAttributes: [
    {
      name: "Telemetry Monitoring",
      type: "Skill",
      description: "Monitoring cardiac rhythms via telemetry"
    },
    {
      name: "Cardiac Monitor",
      type: "Tool",
      description: "Operating cardiac monitoring equipment"
    }
  ]
});

// Create roles for Pediatrics
const pediatrician = Role.create({
  title: "Pediatrician",
  seniority: "Senior",
  responsibilities: [],
  requiredAttributes: [
    {
      name: "Pediatric Board Certification",
      type: "Trait",
      description: "Board certified in pediatrics"
    },
    {
      name: "Developmental Assessment",
      type: "Skill",
      description: "Assessing child development milestones"
    }
  ]
});

const pediatricNurse = Role.create({
  title: "Pediatric Nurse",
  seniority: "Mid",
  responsibilities: [],
  requiredAttributes: [
    {
      name: "Pediatric Nursing Certification",
      type: "Trait",
      description: "Certified in pediatric nursing"
    },
    {
      name: "Family Communication",
      type: "Skill",
      description: "Communicating effectively with children and families"
    }
  ]
});

// Create responsibilities for Pediatrician
const wellChildExamResponsibility = Responsibility.create({
  title: "Well-Child Examinations",
  outcome: "Regular health assessments and preventive care for children",
  requiredAttributes: [
    {
      name: "Growth Assessment",
      type: "Skill",
      description: "Evaluating child growth patterns"
    },
    {
      name: "Immunization Knowledge",
      type: "Skill",
      description: "Current knowledge of vaccination schedules"
    }
  ]
});

const developmentalScreeningResponsibility = Responsibility.create({
  title: "Developmental Screening",
  outcome: "Early identification of developmental delays or disorders",
  requiredAttributes: [
    {
      name: "Screening Tools",
      type: "Tool",
      description: "Standardized developmental screening instruments"
    },
    {
      name: "Behavioral Assessment",
      type: "Skill",
      description: "Assessing child behavior and development"
    }
  ]
});

// Assemble the hierarchy
cardiologist.responsibilities.push(diagnosisResponsibility, treatmentPlanningResponsibility);
cardiacNurse.responsibilities.push(patientMonitoringResponsibility);
pediatrician.responsibilities.push(wellChildExamResponsibility, developmentalScreeningResponsibility);

cardiology.roles.push(cardiologist, cardiacNurse);
pediatrics.roles.push(pediatrician, pediatricNurse);

healthcareDomain.specializations.push(cardiology, pediatrics);
professionModel.domains.push(healthcareDomain);

// Demonstrate the hierarchy
console.log("🏥 Healthcare Domain Structure:");
console.log(`Domain: ${healthcareDomain.name}`);
console.log(`Description: ${healthcareDomain.description}`);
console.log(`Core Attributes: ${healthcareDomain.coreAttributes.length}`);

healthcareDomain.coreAttributes.forEach(attr => {
  console.log(`  - ${attr.name} (${attr.type}): ${attr.description}`);
});

console.log(`\nSpecializations: ${healthcareDomain.specializations.length}`);

healthcareDomain.specializations.forEach(spec => {
  console.log(`\n📋 ${spec.name}`);
  console.log(`   Focus: ${spec.focus}`);
  console.log(`   Core Attributes: ${spec.coreAttributes.length}`);
  
  spec.coreAttributes.forEach(attr => {
    console.log(`     - ${attr.name} (${attr.type}): ${attr.description}`);
  });
  
  console.log(`   Roles: ${spec.roles.length}`);
  
  spec.roles.forEach(role => {
    console.log(`\n   👨‍⚕️ ${role.title} (${role.seniority} Level)`);
    console.log(`      Required Attributes: ${role.requiredAttributes.length}`);
    
    role.requiredAttributes.forEach(attr => {
      console.log(`        - ${attr.name} (${attr.type}): ${attr.description}`);
    });
    
    console.log(`      Responsibilities: ${role.responsibilities.length}`);
    
    role.responsibilities.forEach(resp => {
      console.log(`\n        📝 ${resp.title}`);
      console.log(`           Outcome: ${resp.outcome}`);
      console.log(`           Required Attributes: ${resp.requiredAttributes.length}`);
      
      resp.requiredAttributes.forEach(attr => {
        console.log(`             - ${attr.name} (${attr.type}): ${attr.description}`);
      });
    });
  });
});

// Demonstrate querying capabilities
console.log("\n" + "=".repeat(60));
console.log("🔍 QUERYING EXAMPLES");
console.log("=".repeat(60));

// Find all skills across the domain
const allSkills = healthcareDomain.specializations
  .flatMap(spec => [
    ...spec.coreAttributes.filter(attr => attr.type === "Skill"),
    ...spec.roles.flatMap(role => [
      ...role.requiredAttributes.filter(attr => attr.type === "Skill"),
      ...role.responsibilities.flatMap(resp => 
        resp.requiredAttributes.filter(attr => attr.type === "Skill")
      )
    ])
  ]);

console.log(`\n💪 All Skills in Healthcare Domain (${allSkills.length}):`);
allSkills.forEach(skill => {
  console.log(`  - ${skill.name}: ${skill.description}`);
});

// Find all tools
const allTools = healthcareDomain.specializations
  .flatMap(spec => [
    ...spec.coreAttributes.filter(attr => attr.type === "Tool"),
    ...spec.roles.flatMap(role => [
      ...role.requiredAttributes.filter(attr => attr.type === "Tool"),
      ...role.responsibilities.flatMap(resp => 
        resp.requiredAttributes.filter(attr => attr.type === "Tool")
      )
    ])
  ]);

console.log(`\n🛠️ All Tools in Healthcare Domain (${allTools.length}):`);
allTools.forEach(tool => {
  console.log(`  - ${tool.name}: ${tool.description}`);
});

// Find all senior-level roles
const seniorRoles = healthcareDomain.specializations
  .flatMap(spec => spec.roles)
  .filter(role => role.seniority === "Senior");

console.log(`\n🎖️ Senior-Level Roles (${seniorRoles.length}):`);
seniorRoles.forEach(role => {
  console.log(`  - ${role.title}`);
});

console.log("\n" + "=".repeat(60));
console.log("✅ Healthcare example completed successfully!");
console.log("=".repeat(60));
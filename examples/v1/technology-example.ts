import { ProfessionModel, Domain, Specialization, Role, Responsibility, Attribute } from "../../lib/v1";

console.log("=== Technology Professional Hierarchy Example (V1) ===\n");

const professionModel = ProfessionModel.create({
  domains: []
});

// Create the Technology domain
const technologyDomain = Domain.create({
  name: "Technology",
  description: "Software development and technology services domain",
  specializations: [],
  coreAttributes: [
    {
      name: "Problem Solving",
      type: "Skill",
      description: "Analytical thinking and systematic problem-solving approach"
    },
    {
      name: "Version Control",
      type: "Tool",
      description: "Proficiency with Git and version control systems"
    },
    {
      name: "Continuous Learning",
      type: "Trait",
      description: "Commitment to staying current with technology trends"
    },
    {
      name: "Agile Methodology",
      type: "Skill",
      description: "Understanding of Agile/Scrum development processes"
    }
  ]
});

// Create Web Development specialization
const webDevelopment = Specialization.create({
  name: "Web Development",
  focus: "Building web applications and websites",
  coreAttributes: [
    {
      name: "HTML/CSS",
      type: "Skill",
      description: "Markup and styling for web interfaces"
    },
    {
      name: "JavaScript",
      type: "Skill",
      description: "Client-side and server-side JavaScript programming"
    },
    {
      name: "Web Browser DevTools",
      type: "Tool",
      description: "Browser developer tools for debugging and optimization"
    },
    {
      name: "Responsive Design",
      type: "Skill",
      description: "Creating mobile-friendly and adaptive layouts"
    }
  ],
  roles: []
});

// Create Data Science specialization
const dataScience = Specialization.create({
  name: "Data Science",
  focus: "Extracting insights from data using statistical and machine learning methods",
  coreAttributes: [
    {
      name: "Statistical Analysis",
      type: "Skill",
      description: "Statistical methods and hypothesis testing"
    },
    {
      name: "Python/R",
      type: "Skill",
      description: "Programming languages for data analysis"
    },
    {
      name: "Jupyter Notebooks",
      type: "Tool",
      description: "Interactive development environment for data science"
    },
    {
      name: "Data Visualization",
      type: "Skill",
      description: "Creating meaningful visual representations of data"
    }
  ],
  roles: []
});

// Create Mobile Development specialization
const mobileDevelopment = Specialization.create({
  name: "Mobile Development",
  focus: "Building native and cross-platform mobile applications",
  coreAttributes: [
    {
      name: "Mobile UI/UX",
      type: "Skill",
      description: "Designing user interfaces for mobile devices"
    },
    {
      name: "App Store Guidelines",
      type: "Skill",
      description: "Understanding platform-specific app store requirements"
    },
    {
      name: "Mobile Testing Frameworks",
      type: "Tool",
      description: "Tools for testing mobile applications"
    }
  ],
  roles: []
});

// Create roles for Web Development
const frontendDeveloper = Role.create({
  title: "Frontend Developer",
  seniority: "Mid",
  responsibilities: [],
  requiredAttributes: [
    {
      name: "React/Vue/Angular",
      type: "Skill",
      description: "Modern frontend frameworks"
    },
    {
      name: "Cross-browser Compatibility",
      type: "Skill",
      description: "Ensuring consistent behavior across different browsers"
    },
    {
      name: "Performance Optimization",
      type: "Skill",
      description: "Optimizing web application performance"
    }
  ]
});

const fullStackDeveloper = Role.create({
  title: "Full Stack Developer",
  seniority: "Senior",
  responsibilities: [],
  requiredAttributes: [
    {
      name: "Backend Development",
      type: "Skill",
      description: "Server-side programming and API development"
    },
    {
      name: "Database Design",
      type: "Skill",
      description: "Designing and optimizing database schemas"
    },
    {
      name: "Cloud Platforms",
      type: "Tool",
      description: "AWS, Azure, or Google Cloud Platform"
    }
  ]
});

// Create roles for Data Science
const dataAnalyst = Role.create({
  title: "Data Analyst",
  seniority: "Junior",
  responsibilities: [],
  requiredAttributes: [
    {
      name: "SQL",
      type: "Skill",
      description: "Database querying and data manipulation"
    },
    {
      name: "Excel/Spreadsheets",
      type: "Tool",
      description: "Advanced spreadsheet analysis"
    },
    {
      name: "Business Intelligence Tools",
      type: "Tool",
      description: "Tableau, Power BI, or similar BI tools"
    }
  ]
});

const machineLearningEngineer = Role.create({
  title: "Machine Learning Engineer",
  seniority: "Senior",
  responsibilities: [],
  requiredAttributes: [
    {
      name: "Machine Learning Algorithms",
      type: "Skill",
      description: "Understanding of ML algorithms and their applications"
    },
    {
      name: "Model Deployment",
      type: "Skill",
      description: "Deploying ML models to production environments"
    },
    {
      name: "TensorFlow/PyTorch",
      type: "Tool",
      description: "Deep learning frameworks"
    }
  ]
});

// Create roles for Mobile Development
const iosDeveloper = Role.create({
  title: "iOS Developer",
  seniority: "Mid",
  responsibilities: [],
  requiredAttributes: [
    {
      name: "Swift/Objective-C",
      type: "Skill",
      description: "iOS native programming languages"
    },
    {
      name: "Xcode",
      type: "Tool",
      description: "Apple's integrated development environment"
    },
    {
      name: "iOS SDK",
      type: "Skill",
      description: "iOS Software Development Kit and frameworks"
    }
  ]
});

// Create responsibilities for Frontend Developer
const uiImplementationResponsibility = Responsibility.create({
  title: "User Interface Implementation",
  outcome: "Pixel-perfect, responsive user interfaces that match design specifications",
  requiredAttributes: [
    {
      name: "CSS Frameworks",
      type: "Tool",
      description: "Bootstrap, Tailwind CSS, or similar frameworks"
    },
    {
      name: "Design Systems",
      type: "Skill",
      description: "Implementing and maintaining design system components"
    }
  ]
});

const frontendTestingResponsibility = Responsibility.create({
  title: "Frontend Testing",
  outcome: "Comprehensive test coverage for user interface components",
  requiredAttributes: [
    {
      name: "Jest/Cypress",
      type: "Tool",
      description: "Frontend testing frameworks"
    },
    {
      name: "Test-Driven Development",
      type: "Skill",
      description: "Writing tests before implementation"
    }
  ]
});

// Create responsibilities for Full Stack Developer
const apiDevelopmentResponsibility = Responsibility.create({
  title: "API Development",
  outcome: "Robust, scalable APIs that serve frontend applications",
  requiredAttributes: [
    {
      name: "RESTful Services",
      type: "Skill",
      description: "Designing and implementing REST APIs"
    },
    {
      name: "API Documentation",
      type: "Skill",
      description: "Creating comprehensive API documentation"
    },
    {
      name: "Postman/Insomnia",
      type: "Tool",
      description: "API testing and documentation tools"
    }
  ]
});

const systemArchitectureResponsibility = Responsibility.create({
  title: "System Architecture",
  outcome: "Scalable, maintainable system architecture decisions",
  requiredAttributes: [
    {
      name: "Microservices",
      type: "Skill",
      description: "Designing microservice architectures"
    },
    {
      name: "Load Balancing",
      type: "Skill",
      description: "Implementing load balancing strategies"
    },
    {
      name: "Docker/Kubernetes",
      type: "Tool",
      description: "Containerization and orchestration tools"
    }
  ]
});

// Create responsibilities for Data Analyst
const dataExplorationResponsibility = Responsibility.create({
  title: "Data Exploration",
  outcome: "Comprehensive understanding of data patterns and anomalies",
  requiredAttributes: [
    {
      name: "Exploratory Data Analysis",
      type: "Skill",
      description: "Systematic approach to exploring datasets"
    },
    {
      name: "Data Cleaning",
      type: "Skill",
      description: "Identifying and correcting data quality issues"
    }
  ]
});

// Create responsibilities for Machine Learning Engineer
const modelDevelopmentResponsibility = Responsibility.create({
  title: "Model Development",
  outcome: "Accurate, efficient machine learning models for production use",
  requiredAttributes: [
    {
      name: "Feature Engineering",
      type: "Skill",
      description: "Creating and selecting relevant features for ML models"
    },
    {
      name: "Model Validation",
      type: "Skill",
      description: "Cross-validation and performance evaluation techniques"
    },
    {
      name: "MLflow/Kubeflow",
      type: "Tool",
      description: "ML pipeline and experiment tracking tools"
    }
  ]
});

// Create responsibilities for iOS Developer
const iosAppDevelopmentResponsibility = Responsibility.create({
  title: "iOS App Development",
  outcome: "High-quality iOS applications that meet App Store standards",
  requiredAttributes: [
    {
      name: "UIKit/SwiftUI",
      type: "Skill",
      description: "iOS user interface frameworks"
    },
    {
      name: "Core Data",
      type: "Skill",
      description: "iOS data persistence framework"
    },
    {
      name: "App Store Connect",
      type: "Tool",
      description: "Apple's app distribution platform"
    }
  ]
});

// Assemble the hierarchy
frontendDeveloper.responsibilities.push(uiImplementationResponsibility, frontendTestingResponsibility);
fullStackDeveloper.responsibilities.push(apiDevelopmentResponsibility, systemArchitectureResponsibility);
dataAnalyst.responsibilities.push(dataExplorationResponsibility);
machineLearningEngineer.responsibilities.push(modelDevelopmentResponsibility);
iosDeveloper.responsibilities.push(iosAppDevelopmentResponsibility);

webDevelopment.roles.push(frontendDeveloper, fullStackDeveloper);
dataScience.roles.push(dataAnalyst, machineLearningEngineer);
mobileDevelopment.roles.push(iosDeveloper);

technologyDomain.specializations.push(webDevelopment, dataScience, mobileDevelopment);
professionModel.domains.push(technologyDomain);

// Demonstrate the hierarchy
console.log("💻 Technology Domain Structure:");
console.log(`Domain: ${technologyDomain.name}`);
console.log(`Description: ${technologyDomain.description}`);
console.log(`Core Attributes: ${technologyDomain.coreAttributes.length}`);

technologyDomain.coreAttributes.forEach(attr => {
  console.log(`  - ${attr.name} (${attr.type}): ${attr.description}`);
});

console.log(`\nSpecializations: ${technologyDomain.specializations.length}`);

technologyDomain.specializations.forEach(spec => {
  console.log(`\n🔧 ${spec.name}`);
  console.log(`   Focus: ${spec.focus}`);
  console.log(`   Core Attributes: ${spec.coreAttributes.length}`);
  
  spec.coreAttributes.forEach(attr => {
    console.log(`     - ${attr.name} (${attr.type}): ${attr.description}`);
  });
  
  console.log(`   Roles: ${spec.roles.length}`);
  
  spec.roles.forEach(role => {
    console.log(`\n   👨‍💻 ${role.title} (${role.seniority} Level)`);
    console.log(`      Required Attributes: ${role.requiredAttributes.length}`);
    
    role.requiredAttributes.forEach(attr => {
      console.log(`        - ${attr.name} (${attr.type}): ${attr.description}`);
    });
    
    console.log(`      Responsibilities: ${role.responsibilities.length}`);
    
    role.responsibilities.forEach(resp => {
      console.log(`\n        📋 ${resp.title}`);
      console.log(`           Outcome: ${resp.outcome}`);
      console.log(`           Required Attributes: ${resp.requiredAttributes.length}`);
      
      resp.requiredAttributes.forEach(attr => {
        console.log(`             - ${attr.name} (${attr.type}): ${attr.description}`);
      });
    });
  });
});

// Demonstrate advanced querying capabilities
console.log("\n" + "=".repeat(60));
console.log("🔍 ADVANCED QUERYING EXAMPLES");
console.log("=".repeat(60));

// Find all programming languages/frameworks (skills containing common tech terms)
const programmingSkills = technologyDomain.specializations
  .flatMap(spec => [
    ...spec.coreAttributes.filter(attr => attr.type === "Skill"),
    ...spec.roles.flatMap(role => [
      ...role.requiredAttributes.filter(attr => attr.type === "Skill"),
      ...role.responsibilities.flatMap(resp => 
        resp.requiredAttributes.filter(attr => attr.type === "Skill")
      )
    ])
  ])
  .filter(skill => 
    skill.name.includes("/") || 
    skill.name.includes("JavaScript") || 
    skill.name.includes("Python") ||
    skill.name.includes("Swift") ||
    skill.name.includes("SQL")
  );

console.log(`\n🚀 Programming Languages & Frameworks (${programmingSkills.length}):`);
programmingSkills.forEach(skill => {
  console.log(`  - ${skill.name}: ${skill.description}`);
});

// Find all development tools
const developmentTools = technologyDomain.specializations
  .flatMap(spec => [
    ...spec.coreAttributes.filter(attr => attr.type === "Tool"),
    ...spec.roles.flatMap(role => [
      ...role.requiredAttributes.filter(attr => attr.type === "Tool"),
      ...role.responsibilities.flatMap(resp => 
        resp.requiredAttributes.filter(attr => attr.type === "Tool")
      )
    ])
  ]);

console.log(`\n🛠️ Development Tools (${developmentTools.length}):`);
developmentTools.forEach(tool => {
  console.log(`  - ${tool.name}: ${tool.description}`);
});

// Find roles by seniority level
const seniorityLevels = ["Junior", "Mid", "Senior"];
seniorityLevels.forEach(level => {
  const rolesAtLevel = technologyDomain.specializations
    .flatMap(spec => spec.roles)
    .filter(role => role.seniority === level);
  
  if (rolesAtLevel.length > 0) {
    console.log(`\n🎯 ${level} Level Roles (${rolesAtLevel.length}):`);
    rolesAtLevel.forEach(role => {
      console.log(`  - ${role.title}`);
    });
  }
});

// Find specializations with the most roles
const specializationsByRoleCount = technologyDomain.specializations
  .map(spec => ({ name: spec.name, roleCount: spec.roles.length }))
  .sort((a, b) => b.roleCount - a.roleCount);

console.log(`\n📊 Specializations by Role Count:`);
specializationsByRoleCount.forEach(spec => {
  console.log(`  - ${spec.name}: ${spec.roleCount} roles`);
});

// Calculate total responsibilities across the domain
const totalResponsibilities = technologyDomain.specializations
  .flatMap(spec => spec.roles)
  .reduce((total, role) => total + role.responsibilities.length, 0);

console.log(`\n📈 Domain Statistics:`);
console.log(`  - Total Specializations: ${technologyDomain.specializations.length}`);
console.log(`  - Total Roles: ${technologyDomain.specializations.flatMap(spec => spec.roles).length}`);
console.log(`  - Total Responsibilities: ${totalResponsibilities}`);
console.log(`  - Total Attributes: ${technologyDomain.coreAttributes.length + 
  technologyDomain.specializations.reduce((total, spec) => 
    total + spec.coreAttributes.length + 
    spec.roles.reduce((roleTotal, role) => 
      roleTotal + role.requiredAttributes.length + 
      role.responsibilities.reduce((respTotal, resp) => 
        respTotal + resp.requiredAttributes.length, 0), 0), 0)}`);

console.log("\n" + "=".repeat(60));
console.log("✅ Technology example completed successfully!");
console.log("=".repeat(60));
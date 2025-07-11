import { 
  Enterprise,
  DomainModel, 
  IndustryModel, 
  ProfessionModel, 
  FieldModel, 
  RoleModel, 
  TaskModel 
} from "../../lib/v2";

console.log("=== Software Company Professional Hierarchy Example (V2) ===\n");

const enterprise = Enterprise.create({});

enterprise.addDomain({
  name: "STEM",
  description: "Science, Technology, Engineering, and Mathematics domain"
});

const stemDomain = enterprise.domains[0];

stemDomain.addIndustry({
  name: "Software",
  description: "Software development and technology services industry"
});

const softwareIndustry = stemDomain.industries[0];

softwareIndustry.addProfession({
  name: "Software Engineering",
  description: "Design, development, and maintenance of software systems"
});

const softwareEngineering = softwareIndustry.professions[0];

const fieldData = [
  {
    name: "Backend Development",
    description: "Server-side application development, APIs, and database management"
  },
  {
    name: "Frontend Development", 
    description: "User interface and user experience development"
  },
  {
    name: "DevOps Engineering",
    description: "Development operations, CI/CD, and infrastructure management"
  },
  {
    name: "Mobile Development",
    description: "Native and cross-platform mobile application development"
  },
  {
    name: "Data Engineering",
    description: "Data pipeline development and big data processing"
  }
];

fieldData.forEach(field => {
  softwareEngineering.addField(field);
});

const [backendField, frontendField, devopsField, mobileField, dataField] = softwareEngineering.fields;

const backendRoles = [
  {
    title: "Senior Backend Engineer",
    summary: "Lead backend development initiatives and mentor junior developers"
  },
  {
    title: "API Developer",
    summary: "Design and implement RESTful and GraphQL APIs"
  },
  {
    title: "Database Engineer",
    summary: "Design, optimize, and maintain database systems"
  }
];

backendRoles.forEach(role => {
  backendField.addRole(role);
});

const frontendRoles = [
  {
    title: "React Developer",
    summary: "Build modern web applications using React ecosystem"
  },
  {
    title: "UI/UX Engineer",
    summary: "Bridge design and development with focus on user experience"
  }
];

frontendRoles.forEach(role => {
  frontendField.addRole(role);
});

devopsField.addRole({
  title: "DevOps Engineer",
  summary: "Manage CI/CD pipelines and cloud infrastructure"
});

devopsField.addRole({
  title: "Site Reliability Engineer",
  summary: "Ensure system reliability, monitoring, and incident response"
});

mobileField.addRole({
  title: "iOS Developer",
  summary: "Develop native iOS applications using Swift and iOS SDK"
});

mobileField.addRole({
  title: "React Native Developer", 
  summary: "Build cross-platform mobile apps using React Native"
});

dataField.addRole({
  title: "Data Pipeline Engineer",
  summary: "Build and maintain data processing pipelines"
});

const seniorBackendEngineer = backendField.roles[0];
const apiDeveloper = backendField.roles[1];
const databaseEngineer = backendField.roles[2];

const seniorBackendTasks = [
  {
    name: "Design system architecture",
    description: "Create scalable and maintainable system architecture designs"
  },
  {
    name: "Code review and mentoring",
    description: "Review code submissions and mentor junior team members"
  },
  {
    name: "Performance optimization",
    description: "Identify and resolve performance bottlenecks in backend systems"
  },
  {
    name: "Technical documentation",
    description: "Create and maintain comprehensive technical documentation"
  }
];

seniorBackendTasks.forEach(task => {
  seniorBackendEngineer.addTask(task);
});

const apiDeveloperTasks = [
  {
    name: "Design REST endpoints",
    description: "Create RESTful API endpoints following best practices"
  },
  {
    name: "Implement GraphQL resolvers",
    description: "Build GraphQL schema and resolver functions"
  },
  {
    name: "API documentation",
    description: "Document API endpoints using OpenAPI/Swagger specifications"
  },
  {
    name: "API testing",
    description: "Write comprehensive tests for API endpoints"
  }
];

apiDeveloperTasks.forEach(task => {
  apiDeveloper.addTask(task);
});

const databaseEngineerTasks = [
  {
    name: "Database schema design",
    description: "Design efficient and normalized database schemas"
  },
  {
    name: "Query optimization",
    description: "Optimize database queries for better performance"
  },
  {
    name: "Database migration scripts",
    description: "Create and manage database migration scripts"
  },
  {
    name: "Backup and recovery procedures",
    description: "Implement and maintain database backup and recovery strategies"
  }
];

databaseEngineerTasks.forEach(task => {
  databaseEngineer.addTask(task);
});

const reactDeveloper = frontendField.roles[0];
const uiuxEngineer = frontendField.roles[1];

const reactDeveloperTasks = [
  {
    name: "Build React components",
    description: "Create reusable and performant React components"
  },
  {
    name: "State management implementation",
    description: "Implement state management using Redux, Zustand, or Context API"
  },
  {
    name: "Frontend testing",
    description: "Write unit and integration tests for React components"
  },
  {
    name: "Bundle optimization",
    description: "Optimize webpack bundles for better performance"
  }
];

reactDeveloperTasks.forEach(task => {
  reactDeveloper.addTask(task);
});

const uiuxEngineerTasks = [
  {
    name: "Design system implementation",
    description: "Implement and maintain design system components"
  },
  {
    name: "Accessibility compliance",
    description: "Ensure applications meet WCAG accessibility standards"
  },
  {
    name: "User experience optimization",
    description: "Analyze and improve user interaction patterns"
  }
];

uiuxEngineerTasks.forEach(task => {
  uiuxEngineer.addTask(task);
});

const devopsEngineer = devopsField.roles[0];
const sreEngineer = devopsField.roles[1];

const devopsEngineerTasks = [
  {
    name: "CI/CD pipeline setup",
    description: "Configure continuous integration and deployment pipelines"
  },
  {
    name: "Infrastructure as Code",
    description: "Manage infrastructure using Terraform, CloudFormation, or similar tools"
  },
  {
    name: "Container orchestration",
    description: "Deploy and manage applications using Docker and Kubernetes"
  },
  {
    name: "Cloud resource management",
    description: "Optimize cloud resource usage and costs"
  }
];

devopsEngineerTasks.forEach(task => {
  devopsEngineer.addTask(task);
});

const sreEngineerTasks = [
  {
    name: "Monitoring and alerting",
    description: "Set up comprehensive monitoring and alerting systems"
  },
  {
    name: "Incident response",
    description: "Respond to and resolve production incidents"
  },
  {
    name: "Capacity planning",
    description: "Plan and manage system capacity and scaling"
  },
  {
    name: "Post-mortem analysis",
    description: "Conduct post-incident analysis and implement improvements"
  }
];

sreEngineerTasks.forEach(task => {
  sreEngineer.addTask(task);
});

const iosDeveloper = mobileField.roles[0];
const reactNativeDeveloper = mobileField.roles[1];

const iosDeveloperTasks = [
  {
    name: "iOS app development",
    description: "Build native iOS applications using Swift and UIKit/SwiftUI"
  },
  {
    name: "App Store submission",
    description: "Prepare and submit apps to the Apple App Store"
  },
  {
    name: "iOS performance optimization",
    description: "Optimize app performance and memory usage"
  }
];

iosDeveloperTasks.forEach(task => {
  iosDeveloper.addTask(task);
});

const reactNativeDeveloperTasks = [
  {
    name: "Cross-platform development",
    description: "Build apps that work on both iOS and Android platforms"
  },
  {
    name: "Native module integration",
    description: "Integrate native iOS and Android modules when needed"
  },
  {
    name: "App performance tuning",
    description: "Optimize React Native app performance and bundle size"
  }
];

reactNativeDeveloperTasks.forEach(task => {
  reactNativeDeveloper.addTask(task);
});

const dataPipelineEngineer = dataField.roles[0];

const dataPipelineEngineerTasks = [
  {
    name: "ETL pipeline development",
    description: "Build Extract, Transform, Load pipelines for data processing"
  },
  {
    name: "Data quality monitoring",
    description: "Implement data quality checks and monitoring systems"
  },
  {
    name: "Big data processing",
    description: "Process large datasets using Spark, Hadoop, or similar technologies"
  },
  {
    name: "Data warehouse management",
    description: "Design and maintain data warehouse schemas and processes"
  }
];

dataPipelineEngineerTasks.forEach(task => {
  dataPipelineEngineer.addTask(task);
});

console.log("🏢 Software Company Hierarchy Structure:");
console.log("=".repeat(60));

console.log(`\n🌐 Domain: ${stemDomain.name}`);
console.log(`   Description: ${stemDomain.description}`);
console.log(`   Industries: ${stemDomain.industries.length}`);

stemDomain.industries.forEach(industry => {
  console.log(`\n   🏭 Industry: ${industry.name}`);
  console.log(`      Description: ${industry.description}`);
  console.log(`      Professions: ${industry.professions.length}`);
  
  industry.professions.forEach(profession => {
    console.log(`\n      👨‍💼 Profession: ${profession.name}`);
    console.log(`         Description: ${profession.description}`);
    console.log(`         Fields: ${profession.fields.length}`);
    
    profession.fields.forEach(field => {
      console.log(`\n         🔧 Field: ${field.name}`);
      console.log(`            Description: ${field.description}`);
      console.log(`            Roles: ${field.roles.length}`);
      
      field.roles.forEach(role => {
        console.log(`\n            👤 Role: ${role.title}`);
        console.log(`               Summary: ${role.summary}`);
        console.log(`               Tasks: ${role.tasks.length}`);
        
        role.tasks.forEach((task, index) => {
          console.log(`               ${index + 1}. ${task.name}`);
          if (task.description) {
            console.log(`                  → ${task.description}`);
          }
        });
      });
    });
  });
});

console.log("\n" + "=".repeat(60));
console.log("🔍 V2 ADVANCED FEATURES DEMONSTRATION");
console.log("=".repeat(60));

console.log("\n🆔 UUID Identifiers:");
console.log(`Domain ID: ${stemDomain.id}`);
console.log(`Industry ID: ${softwareIndustry.id}`);
console.log(`Profession ID: ${softwareEngineering.id}`);
console.log(`First Field ID: ${backendField.id}`);
console.log(`First Role ID: ${seniorBackendEngineer.id}`);
console.log(`First Task ID: ${seniorBackendEngineer.tasks[0].id}`);

console.log(`\n📊 All Tasks in Software Industry (${softwareIndustry.allTasks.length}):`);
softwareIndustry.allTasks.forEach((task, index) => {
  console.log(`${index + 1}. ${task.name}`);
});

console.log(`\n🔧 Tasks by Field:`);
softwareEngineering.fields.forEach(field => {
  console.log(`${field.name}: ${field.allTasks.length} tasks`);
});

console.log("\n⚡ CRUD Operations Demonstration:");

console.log("\n➕ Adding new field: 'Quality Assurance'");
softwareEngineering.addField({
  name: "Quality Assurance",
  description: "Software testing and quality assurance"
});

const qaField = softwareEngineering.fields[softwareEngineering.fields.length - 1];
console.log(`✅ Added field: ${qaField.name} (ID: ${qaField.id})`);

qaField.addRole({
  title: "QA Engineer",
  summary: "Ensure software quality through comprehensive testing"
});

const qaEngineer = qaField.roles[0];
console.log(`✅ Added role: ${qaEngineer.title} (ID: ${qaEngineer.id})`);

const qaTasks = [
  {
    name: "Test case development",
    description: "Create comprehensive test cases for software features"
  },
  {
    name: "Automated testing",
    description: "Develop and maintain automated test suites"
  },
  {
    name: "Bug reporting and tracking",
    description: "Identify, document, and track software defects"
  }
];

qaTasks.forEach(task => {
  qaEngineer.addTask(task);
});

console.log(`✅ Added ${qaTasks.length} tasks to QA Engineer`);

const firstQATask = qaEngineer.tasks[0];
console.log(`\n✏️ Updating task: "${firstQATask.name}"`);
firstQATask.update({
  name: "Comprehensive Test Case Development",
  description: "Create detailed test cases covering functional, integration, and edge cases"
});
console.log(`✅ Updated to: "${firstQATask.name}"`);

console.log(`\n🗑️ Removing last task from QA Engineer`);
const taskToRemove = qaEngineer.tasks[qaEngineer.tasks.length - 1];
console.log(`Removing: "${taskToRemove.name}"`);
qaEngineer.removeTask(taskToRemove);
console.log(`✅ Task removed. QA Engineer now has ${qaEngineer.tasks.length} tasks`);

console.log("\n🔍 Advanced Querying:");

const engineerRoles = softwareEngineering.fields
  .flatMap(field => field.roles)
  .filter(role => role.title.includes("Engineer"));

console.log(`\n👷 Roles with "Engineer" in title (${engineerRoles.length}):`);
engineerRoles.forEach(role => {
  console.log(`  - ${role.title}`);
});

const fieldTaskCounts = softwareEngineering.fields
  .map(field => ({
    name: field.name,
    taskCount: field.allTasks.length
  }))
  .sort((a, b) => b.taskCount - a.taskCount);

console.log(`\n📈 Fields by Task Count:`);
fieldTaskCounts.forEach(field => {
  console.log(`  - ${field.name}: ${field.taskCount} tasks`);
});

const developmentTasks = enterprise.allTasks
  .filter(task => 
    task.name.toLowerCase().includes("develop") || 
    task.description?.toLowerCase().includes("develop")
  );

console.log(`\n💻 Development-related Tasks (${developmentTasks.length}):`);
developmentTasks.forEach(task => {
  console.log(`  - ${task.name}`);
});

console.log("\n📊 Complete Hierarchy Statistics:");
console.log(`  - Domains: ${enterprise.domains.length}`);
console.log(`  - Industries: ${enterprise.domains.reduce((sum, d) => sum + d.industries.length, 0)}`);
console.log(`  - Professions: ${enterprise.domains.reduce((sum, d) => sum + d.industries.reduce((sum2, i) => sum2 + i.professions.length, 0), 0)}`);
console.log(`  - Fields: ${enterprise.domains.reduce((sum, d) => sum + d.industries.reduce((sum2, i) => sum2 + i.professions.reduce((sum3, p) => sum3 + p.fields.length, 0), 0), 0)}`);
console.log(`  - Roles: ${enterprise.domains.reduce((sum, d) => sum + d.industries.reduce((sum2, i) => sum2 + i.professions.reduce((sum3, p) => sum3 + p.fields.reduce((sum4, f) => sum4 + f.roles.length, 0), 0), 0), 0)}`);
console.log(`  - Tasks: ${enterprise.allTasks.length}`);

console.log("\n" + "=".repeat(60));
console.log("✅ Software Company example completed successfully!");
console.log("This example demonstrates the full 6-layer hierarchy with:");
console.log("  • UUID-based identifiers for distributed systems");
console.log("  • Comprehensive CRUD operations");
console.log("  • Compositional queries and views");
console.log("  • Real-world software company structure");
console.log("  • Advanced querying capabilities");
console.log("=".repeat(60));
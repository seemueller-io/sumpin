import HierarchyAgent from './lib/agent-wrapper';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create the hierarchy agent with enhanced instructions
const hierarchyAgent = new HierarchyAgent({
    name: 'Professional Hierarchy Generator',
    instructions: `You are an expert at creating professional hierarchy models. 
    You understand organizational structures, job roles, skills, and professional development paths.
    Generate comprehensive, realistic examples that demonstrate best practices in professional modeling.

    Focus on creating practical, implementable hierarchies that reflect real-world organizational structures.
    Include relevant skills, tools, and technologies for each role.
    Provide clear examples of how the hierarchy can be used in practice.`,
});

// Demonstrate the modular agent capabilities
async function demonstrateAgentCapabilities() {
    console.log('🚀 Demonstrating Professional Hierarchy Agent Capabilities...\n');

    // Show available templates
    console.log('📋 Available Templates:');
    const templates = hierarchyAgent.getAvailableTemplates();
    templates.forEach(template => {
        console.log(`  - ${template.domain} (${template.version}): ${template.description}`);
    });
    console.log();

    // Generate examples using different approaches
    const examples = [
        {
            name: 'Education Domain (using template)',
            options: {
                domain: 'education',
                templateKey: 'education-v2',
                complexity: 'complex' as const,
                includeSkills: true,
                includeTools: true,
                includeExamples: true
            }
        },
        {
            name: 'Manufacturing Domain (custom generation)',
            options: {
                domain: 'manufacturing',
                version: 'v2' as const,
                complexity: 'medium' as const,
                includeSkills: true,
                includeTools: true,
                includeExamples: true
            }
        },
        {
            name: 'Retail Domain (simple v1)',
            options: {
                domain: 'retail',
                version: 'v1' as const,
                complexity: 'simple' as const,
                includeSkills: false,
                includeTools: false,
                includeExamples: true
            }
        }
    ];

    // Create examples directory
    const examplesDir = join(process.cwd(), 'examples', 'generated');
    mkdirSync(examplesDir, { recursive: true });

    // Generate each example with streaming for visibility
    for (const example of examples) {
        try {
            console.log(`📊 Generating: ${example.name}...`);
            console.log('🔍 Watch the agent work in real-time:\n');

            // Use streaming to show what the agent is doing
            const result = await hierarchyAgent.generateHierarchyWithStreaming(
                example.options,
                (event) => {
                    // Enhanced trace information for agent activities
                    if (event.type === 'agent_updated_stream_event') {
                        console.log(`[TRACE] 🤖 Agent: ${event.agent?.name || 'Unknown'} - Status updated`);
                    } else if (event.type === 'run_item_stream_event') {
                        if (event.item?.type === 'tool_call_item') {
                            console.log(`[TRACE] 🔧 Tool Call: ${event.item.tool_call?.function?.name || 'Unknown tool'}`);
                            if (event.item.tool_call?.function?.arguments) {
                                try {
                                    const args = JSON.parse(event.item.tool_call.function.arguments);
                                    console.log(`[TRACE] 📋 Tool Arguments: ${JSON.stringify(args, null, 2)}`);
                                } catch (e) {
                                    console.log(`[TRACE] 📋 Tool Arguments: ${event.item.tool_call.function.arguments}`);
                                }
                            }
                        } else if (event.item?.type === 'tool_call_output_item') {
                            console.log(`[TRACE] ✅ Tool Output: Received response`);
                        } else if (event.item?.type === 'message_output_item') {
                            console.log(`[TRACE] 💬 Message: Generating response content`);
                        }
                    } else if (event.type === 'raw_model_stream_event' && event.delta?.content) {
                        // Show partial content being generated (throttled)
                        process.stdout.write('.');
                    } else if (event.type === 'run_started_stream_event') {
                        console.log(`[TRACE] 🚀 Run Started: Beginning agent execution`);
                    } else if (event.type === 'run_completed_stream_event') {
                        console.log(`[TRACE] 🏁 Run Completed: Agent execution finished`);
                    }
                }
            );

            console.log(); // New line after dots

            // Write the generated example to a file
            const filepath = join(examplesDir, `${result.filename}.${result.extension}`);
            writeFileSync(filepath, result.content);

            console.log(`✅ Generated: ${filepath}`);
            console.log(`   Format: typescript (default)`);
            console.log(`   Complexity: ${example.options.complexity}`);
            console.log();

        } catch (error) {
            console.error(`❌ Error generating ${example.name}:`, error);
        }
    }

    // Demonstrate batch generation with streaming
    console.log('🔄 Demonstrating batch generation with streaming...');
    const batchDomains = ['logistics', 'consulting', 'media'];

    const batchResults = [];
    for (const domain of batchDomains) {
        try {
            console.log(`📊 Batch generating: ${domain} domain...`);
            console.log('🔍 Streaming agent progress:\n');

            const result = await hierarchyAgent.generateHierarchyWithStreaming({
                domain,
                version: 'v2',
                complexity: 'medium',
                includeSkills: true,
                includeTools: true,
                includeExamples: true
            }, (event) => {
                // Enhanced trace information for batch generation
                if (event.type === 'agent_updated_stream_event') {
                    console.log(`[BATCH TRACE] 🤖 Agent: ${event.agent?.name || 'Unknown'} - Status updated`);
                } else if (event.type === 'run_item_stream_event') {
                    if (event.item?.type === 'tool_call_item') {
                        console.log(`[BATCH TRACE] 🔧 Tool Call: ${event.item.tool_call?.function?.name || 'Unknown tool'}`);
                        if (event.item.tool_call?.function?.arguments) {
                            try {
                                const args = JSON.parse(event.item.tool_call.function.arguments);
                                console.log(`[BATCH TRACE] 📋 Tool Arguments: ${JSON.stringify(args, null, 2)}`);
                            } catch (e) {
                                console.log(`[BATCH TRACE] 📋 Tool Arguments: ${event.item.tool_call.function.arguments}`);
                            }
                        }
                    } else if (event.item?.type === 'tool_call_output_item') {
                        console.log(`[BATCH TRACE] ✅ Tool Output: Received response`);
                    } else if (event.item?.type === 'message_output_item') {
                        console.log(`[BATCH TRACE] 💬 Message: Generating response content`);
                    }
                } else if (event.type === 'raw_model_stream_event' && event.delta?.content) {
                    // Show partial content being generated (throttled)
                    process.stdout.write('.');
                } else if (event.type === 'run_started_stream_event') {
                    console.log(`[BATCH TRACE] 🚀 Run Started: Beginning agent execution for ${domain}`);
                } else if (event.type === 'run_completed_stream_event') {
                    console.log(`[BATCH TRACE] 🏁 Run Completed: Agent execution finished for ${domain}`);
                }
            });

            console.log(); // New line after dots
            batchResults.push(result);

            // Save batch result immediately
            const filepath = join(examplesDir, `batch-${result.filename}.${result.extension}`);
            writeFileSync(filepath, result.content);
            console.log(`✅ Batch generated: ${filepath}`);
            console.log();

        } catch (error) {
            console.error(`❌ Error in batch generation for ${domain}:`, error);
        }
    }

    console.log('\n🎉 Agent capability demonstration complete!');
    console.log(`📁 All examples saved to: ${examplesDir}`);

    // Show summary
    console.log('\n📊 Generation Summary:');
    console.log(`   Individual examples: ${examples.length}`);
    console.log(`   Batch examples: ${batchResults.length}`);
    console.log(`   Total files generated: ${examples.length + batchResults.length}`);
    console.log(`   Available templates: ${templates.length}`);
}

// Run the demonstration
demonstrateAgentCapabilities().catch(console.error);

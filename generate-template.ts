#!/usr/bin/env bun

/*
 * hierarchyGenerator.ts
 * ------------------------------------------------------------
 * A tiny OpenAI‑powered helper that turns natural‑language prompts
 * into domain hierarchies matching `HierarchyModel` (mobx‑state‑tree).
 * ------------------------------------------------------------
 * Usage example:
 *   import { generateHierarchy } from "./hierarchyGenerator";
 *   const hierarchy = await generateHierarchy("Create a v2 Healthcare hierarchy for mental health services");
 *
 * The function returns a live MST instance of `HierarchyModel` so it
 * can be plugged straight into your state tree or persisted as JSON.
 */

import OpenAI from "openai";
import { HierarchyModel } from "./lib/hierarchy-model.ts";
import type { Instance } from "mobx-state-tree";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/**
 * Shape produced by the LLM and accepted by `HierarchyModel`.
 */
export interface Hierarchy {
    version: "v1" | "v2";
    domain: string;              // e.g. "Finance", "Technology"
    structure: string[];         // ordered list of hierarchy labels
    description: string;         // plain‑text description
    commonSkills: string[];
    commonTools: string[];
    examples: string[];
}

// ---------------------------------------------------------------------------
// OpenAI client configuration
// ---------------------------------------------------------------------------

const openai = new OpenAI({
    // Rely on OPENAI_API_KEY env var or pass explicit key here
    apiKey: process.env.OPENAI_API_KEY,
});

// System prompt used for every request. Keeps the model focused on
// emitting strict JSON with NO extra text.
const SYS_PROMPT = `
You are an API that converts natural‑language descriptions into JSON
objects that conform **exactly** to the following TypeScript interface.
Return the JSON only – no markdown, comments, or additional keys.
If a field is missing in the user's request, make a sensible inference.

interface Hierarchy {
  version: "v1" | "v2";           // one of the two schema versions
  domain: string;                  // high‑level sector name
  structure: string[];             // ordered labels, 4 elements for v1, 6 for v2
  description: string;             // concise explanation of the hierarchy
  commonSkills: string[];          // 3‑7 bullet items
  commonTools: string[];           // 3‑7 bullet items
  examples: string[];              // 3‑7 representative examples
}
`;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert a natural‑language prompt into a fully‑typed `HierarchyModel`.
 *
 * @param nlPrompt – Human description, e.g. "Define a v1 hierarchy for legal services"
 * @param model   – (optional) Which OpenAI model to use. Defaults to GPT‑4o‑mini.
 */
export async function generateHierarchy(
    nlPrompt: string,
    model: string = "gpt-4o-mini"
): Promise<Instance<typeof HierarchyModel>> {
    const chat = await openai.chat.completions.create({
        model,
        response_format: { type: "json_object" }, // guarantees pure JSON
        messages: [
            { role: "system", content: SYS_PROMPT },
            { role: "user", content: nlPrompt },
        ],
    });

    // Defensive parsing — in rare cases the assistant may wrap JSON in text.
    const raw = chat.choices[0]?.message?.content ?? "{}";
    let data: Hierarchy;
    try {
        data = JSON.parse(raw) as Hierarchy;
    } catch {
        // Attempt to salvage JSON embedded in text
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Failed to parse JSON from LLM response");
        data = JSON.parse(match[0]) as Hierarchy;
    }

    // Validate minimal shape before creating MST instance.
    if (!data.version || !data.domain || !data.structure) {
        throw new Error("Incomplete hierarchy returned by LLM");
    }

    return HierarchyModel.create(data);
}

// ---------------------------------------------------------------------------
// Helper: quick command‑line demo when run with ts‑node
// ---------------------------------------------------------------------------

if (require.main === module) {
    (async () => {
        const prompt = process.argv.slice(2).join(" ") ||
            "Create a v2 Technology hierarchy focused on AI safety";
        try {
            const hierarchy = await generateHierarchy(prompt);
            console.log(JSON.stringify(hierarchy.toJSON(), null, 2));
        } catch (err) {
            console.error("Error generating hierarchy:", err);
            process.exitCode = 1;
        }
    })();
}

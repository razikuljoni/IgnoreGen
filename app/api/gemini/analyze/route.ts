import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, repoTree } = await req.json();

    if (!prompt && !repoTree) {
      return NextResponse.json(
        { error: "Please provide a description of your stack or repository file structure." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemPrompt = `You are a Principal DevOps and Git Architect.
Analyze the user's technology stack description or repository tree and recommend:
1. Matching template IDs from our standard catalog if applicable (choose from: node-js, typescript, python, rust, go, java, c-cpp, csharp-dotnet, php, ruby, kotlin, swift, dart, elixir, scala, r-lang, zig, lua, nextjs, react, vue-nuxt, angular, svelte-sveltekit, astro, remix, django, fastapi-flask, laravel, rails, spring-boot, express-nestjs, flutter, react-native-expo, electron-tauri, unity, godot, unreal-engine, pnpm-yarn-npm, pip-poetry-conda, maven-gradle, composer, cocoapods-carthage, macos, windows, linux, vscode, jetbrains, visual-studio, xcode, android-studio, vim-neovim, docker, turborepo, vite-webpack, testing-coverage, terraform, kubernetes-helm, prisma-drizzle, storybook, env-files, keys-certificates, logs-databases, backup-temp).
2. Custom .gitignore rules specifically tailored to any bespoke, custom, or unique tools mentioned in their stack that standard templates might miss.
3. A brief explanation of potential pitfalls or security vulnerabilities to watch out for with their stack.`;

    const userContent = `Stack description:
${prompt || "N/A"}

Repository tree / files:
${repoTree || "N/A"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedStackSummary: {
              type: Type.STRING,
              description: "A concise 1-sentence summary of the detected stack",
            },
            recommendedTemplateIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of valid template IDs from the catalog",
            },
            customRules: {
              type: Type.STRING,
              description: "Custom tailored .gitignore rules (raw string format with comments)",
            },
            securityInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-4 actionable security & git best practices for this stack",
            },
          },
          required: ["detectedStackSummary", "recommendedTemplateIds", "customRules", "securityInsights"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Error analyzing stack with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to analyze stack";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

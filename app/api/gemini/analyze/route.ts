import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const systemPrompt = `You are a Principal DevOps and Git Architect.
Analyze the user's technology stack description or repository tree and recommend:
1. Matching template IDs from our standard catalog if applicable (choose from: node-js, typescript, python, rust, go, java, c-cpp, csharp-dotnet, php, ruby, kotlin, swift, dart, elixir, scala, r-lang, zig, lua, nextjs, react, vue-nuxt, angular, svelte-sveltekit, astro, remix, django, fastapi-flask, laravel, rails, spring-boot, express-nestjs, flutter, react-native-expo, electron-tauri, unity, godot, unreal-engine, pnpm-yarn-npm, pip-poetry-conda, maven-gradle, composer, cocoapods-carthage, macos, windows, linux, vscode, jetbrains, visual-studio, xcode, android-studio, vim-neovim, docker, turborepo, vite-webpack, testing-coverage, terraform, kubernetes-helm, prisma-drizzle, storybook, env-files, keys-certificates, logs-databases, backup-temp).
2. Custom .gitignore rules specifically tailored to any bespoke, custom, or unique tools mentioned in their stack that standard templates might miss.
3. A brief explanation of potential pitfalls or security vulnerabilities to watch out for with their stack.`;

    const userContent = `Stack description:
${prompt || "N/A"}

Repository tree / files:
${repoTree || "N/A"}`;

    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    let response;
    let lastError;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                detectedStackSummary: {
                  type: SchemaType.STRING,
                  description: "A concise 1-sentence summary of the detected stack",
                },
                recommendedTemplateIds: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                  description: "List of valid template IDs from the catalog",
                },
                customRules: {
                  type: SchemaType.STRING,
                  description: "Custom tailored .gitignore rules (raw string format with comments)",
                },
                securityInsights: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                  description: "2-4 actionable security & git best practices for this stack",
                },
              },
              required: ["detectedStackSummary", "recommendedTemplateIds", "customRules", "securityInsights"],
            },
          },
        });
        
        const result = await model.generateContent(userContent);
        response = result.response;
        break;
      } catch (e) {
        console.warn(`Model ${modelName} failed, trying next...`, e);
        lastError = e;
      }
    }

    if (!response) {
      console.error("All AI models failed or were unavailable. Using heuristic fallback.");
      
      const detected: string[] = [];
      const lowerRepo = repoTree?.toLowerCase() || "";
      const lowerPrompt = prompt?.toLowerCase() || "";
      
      if (lowerRepo.includes('package.json') || lowerPrompt.includes('node') || lowerPrompt.includes('javascript')) detected.push('node-js');
      if (lowerRepo.includes('tsconfig.json') || lowerPrompt.includes('typescript')) detected.push('typescript');
      if (lowerRepo.includes('requirements.txt') || lowerRepo.includes('pipfile') || lowerPrompt.includes('python')) detected.push('python');
      if (lowerRepo.includes('cargo.toml') || lowerPrompt.includes('rust')) detected.push('rust');
      if (lowerRepo.includes('go.mod') || lowerPrompt.includes('golang')) detected.push('go');
      if (lowerRepo.includes('composer.json') || lowerPrompt.includes('php')) detected.push('php');
      if (lowerRepo.includes('gemfile') || lowerPrompt.includes('ruby')) detected.push('ruby');
      if (lowerRepo.includes('dockerfile') || lowerPrompt.includes('docker')) detected.push('docker');
      if (lowerRepo.includes('.env') || lowerPrompt.includes('env')) detected.push('env-files');
      
      return NextResponse.json({
        detectedStackSummary: "Detected via pattern matching (AI Analysis Offline)",
        recommendedTemplateIds: detected.length > 0 ? detected : [],
        customRules: "",
        securityInsights: [
          "Check for sensitive files like .env or keys manually.",
          "Ensure build artifacts and dependencies are ignored."
        ],
      });
    }

    const text = response.text();
    const parsed = JSON.parse(text || "{}");
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Error analyzing stack with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to analyze stack";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

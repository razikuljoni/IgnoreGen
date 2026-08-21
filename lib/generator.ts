import { TEMPLATES, GitignoreTemplate, RULE_EXPLANATIONS, RuleExplanation } from '@/data/templates';

export interface GeneratorOptions {
  includeComments: boolean;
  sortSections: boolean;
  autoDeduplicate: boolean;
  customRules?: string;
}

export interface GeneratedGitignore {
  rawText: string;
  totalLines: number;
  ruleCount: number;
  commentCount: number;
  uniquePatterns: string[];
  templatesUsed: GitignoreTemplate[];
}

export interface LineToken {
  lineNumber: number;
  text: string;
  type: 'comment' | 'negation' | 'directory' | 'wildcard' | 'rule' | 'empty' | 'header';
  explanation?: RuleExplanation;
}

export function generateGitignore(
  selectedIds: string[],
  options: GeneratorOptions
): GeneratedGitignore {
  const selectedTemplates = TEMPLATES.filter((t) => selectedIds.includes(t.id));

  let templatesToProcess = [...selectedTemplates];
  if (options.sortSections) {
    templatesToProcess.sort((a, b) => a.name.localeCompare(b.name));
  }

  const seenRules = new Set<string>();
  const outputSections: string[] = [];
  let ruleCount = 0;
  let commentCount = 0;
  const uniquePatterns: string[] = [];

  // Add header banner
  if (options.includeComments) {
    outputSections.push(
      `# ==========================================================================\n` +
      `# Generated with .gitignore Generator (https://ai.studio/build)\n` +
      `# Selected Stacks: ${templatesToProcess.map((t) => t.name).join(', ') || 'Custom Rules Only'}\n` +
      `# Generated on: ${new Date().toISOString().split('T')[0]}\n` +
      `# ==========================================================================`
    );
  }

  for (const template of templatesToProcess) {
    const lines = template.content.split('\n');
    const processedLines: string[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        processedLines.push('');
        continue;
      }

      if (line.startsWith('#')) {
        if (options.includeComments) {
          processedLines.push(line);
          commentCount++;
        }
        continue;
      }

      // Rule line
      if (options.autoDeduplicate) {
        if (seenRules.has(line)) {
          continue;
        }
        seenRules.add(line);
      }

      ruleCount++;
      uniquePatterns.push(line);
      processedLines.push(line);
    }

    // Clean multiple consecutive empty lines
    const cleanedSection = processedLines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (cleanedSection) {
      outputSections.push(cleanedSection);
    }
  }

  // Process custom rules if any
  if (options.customRules && options.customRules.trim()) {
    const customLines = options.customRules.split('\n');
    const processedCustom: string[] = [];

    if (options.includeComments) {
      processedCustom.push('# ==========================================================================');
      processedCustom.push('# Custom Project Rules');
      processedCustom.push('# ==========================================================================');
    }

    for (const rawLine of customLines) {
      const line = rawLine.trim();
      if (!line) {
        processedCustom.push('');
        continue;
      }
      if (line.startsWith('#')) {
        if (options.includeComments) {
          processedCustom.push(line);
          commentCount++;
        }
        continue;
      }

      if (options.autoDeduplicate) {
        if (seenRules.has(line)) {
          continue;
        }
        seenRules.add(line);
      }

      ruleCount++;
      uniquePatterns.push(line);
      processedCustom.push(line);
    }

    const customText = processedCustom.join('\n').trim();
    if (customText) {
      outputSections.push(customText);
    }
  }

  const rawText = outputSections.join('\n\n') + '\n';
  const totalLines = rawText.split('\n').length - 1;

  return {
    rawText,
    totalLines,
    ruleCount,
    commentCount,
    uniquePatterns,
    templatesUsed: templatesToProcess,
  };
}

export function tokenizeGitignore(content: string): LineToken[] {
  const lines = content.split('\n');
  return lines.map((text, idx) => {
    const trimmed = text.trim();
    let type: LineToken['type'] = 'rule';
    let explanation: RuleExplanation | undefined = undefined;

    if (!trimmed) {
      type = 'empty';
    } else if (trimmed.startsWith('# ===') || trimmed.startsWith('##')) {
      type = 'header';
    } else if (trimmed.startsWith('#')) {
      type = 'comment';
    } else if (trimmed.startsWith('!')) {
      type = 'negation';
    } else if (trimmed.endsWith('/')) {
      type = 'directory';
    } else if (trimmed.includes('*') || trimmed.includes('?')) {
      type = 'wildcard';
    }

    // Match explanation
    if (type !== 'comment' && type !== 'header' && type !== 'empty') {
      if (RULE_EXPLANATIONS[trimmed]) {
        explanation = RULE_EXPLANATIONS[trimmed];
      } else {
        // Try wildcard matching
        const matchKey = Object.keys(RULE_EXPLANATIONS).find((key) => {
          if (key.includes('*')) {
            const regex = new RegExp('^' + key.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
            return regex.test(trimmed);
          }
          return false;
        });
        if (matchKey) {
          explanation = RULE_EXPLANATIONS[matchKey];
        }
      }
    }

    return {
      lineNumber: idx + 1,
      text,
      type,
      explanation,
    };
  });
}

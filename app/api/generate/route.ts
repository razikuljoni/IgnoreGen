import { NextRequest, NextResponse } from 'next/server';
import { generateGitignore, GeneratorOptions } from '@/lib/generator';
import { TEMPLATES } from '@/data/templates';
import { decodeConfigToken } from '@/lib/short-url';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('s') || searchParams.get('c');

  let templateIds: string[] = [];
  let customRules = '';
  let options: GeneratorOptions;

  if (token) {
    const config = decodeConfigToken(token);
    templateIds = config.selectedIds;
    customRules = config.customRules;
    options = {
      includeComments: searchParams.has('comments')
        ? searchParams.get('comments') !== 'false'
        : config.options.includeComments,
      sortSections: searchParams.has('sort')
        ? searchParams.get('sort') === 'true'
        : config.options.sortSections,
      autoDeduplicate: searchParams.has('dedupe')
        ? searchParams.get('dedupe') !== 'false'
        : config.options.autoDeduplicate,
      customRules,
    };
  } else {
    const templatesParam = searchParams.get('templates');
    templateIds = templatesParam ? templatesParam.split(',').filter(Boolean) : [];
    customRules = searchParams.get('customRules') || '';
    options = {
      includeComments: searchParams.get('comments') !== 'false',
      sortSections: searchParams.get('sort') === 'true',
      autoDeduplicate: searchParams.get('dedupe') !== 'false',
      customRules,
    };
  }

  // Check for any invalid/unsupported template IDs
  const validTemplateIds = new Set(TEMPLATES.map((t) => t.id));
  const invalidIds = templateIds.filter((id) => !validTemplateIds.has(id));
  if (invalidIds.length > 0) {
    return new NextResponse(`Bad Request: Invalid or unsupported template ID(s): ${invalidIds.join(', ')}`, { status: 400 });
  }

  try {
    const generated = generateGitignore(templateIds, options);
    return new NextResponse(generated.rawText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('Error generating .gitignore', { status: 500 });
  }
}

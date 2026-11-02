import { NextRequest, NextResponse } from 'next/server';
import { generateGitignore, GeneratorOptions } from '@/lib/generator';
import { TEMPLATES } from '@/data/templates';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const templatesParam = searchParams.get('templates');
  const templateIds = templatesParam ? templatesParam.split(',').filter(Boolean) : [];
  const customRules = searchParams.get('customRules') || '';

  // Bad Request Validation: at least one input parameter must be provided
  if (templateIds.length === 0 && !customRules.trim()) {
    return new NextResponse('Bad Request: At least one stack template or customRules must be provided.', { status: 400 });
  }

  // Check for any invalid/unsupported template IDs
  const validTemplateIds = new Set(TEMPLATES.map((t) => t.id));
  const invalidIds = templateIds.filter((id) => !validTemplateIds.has(id));
  if (invalidIds.length > 0) {
    return new NextResponse(`Bad Request: Invalid or unsupported template ID(s): ${invalidIds.join(', ')}`, { status: 400 });
  }

  const options: GeneratorOptions = {
    includeComments: searchParams.get('comments') !== 'false',
    sortSections: searchParams.get('sort') === 'true',
    autoDeduplicate: searchParams.get('dedupe') !== 'false',
    customRules,
  };

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

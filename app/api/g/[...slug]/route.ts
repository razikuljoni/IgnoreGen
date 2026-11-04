import { NextRequest, NextResponse } from 'next/server';
import { generateGitignore, GeneratorOptions } from '@/lib/generator';
import { resolveTemplateIdOrAlias } from '@/lib/short-url';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await props.params;
  const { searchParams } = new URL(request.url);

  // Flatten path segments split by '/' and ','
  const rawItems = (slug || [])
    .flatMap((segment) => decodeURIComponent(segment).split(','))
    .map((item) => item.trim())
    .filter(Boolean);

  const templateIds: string[] = [];
  const unrecognized: string[] = [];

  for (const item of rawItems) {
    const resolved = resolveTemplateIdOrAlias(item);
    if (resolved) {
      if (!templateIds.includes(resolved)) {
        templateIds.push(resolved);
      }
    } else {
      unrecognized.push(item);
    }
  }

  if (unrecognized.length > 0) {
    return new NextResponse(
      `Bad Request: Unrecognized stack template or alias: ${unrecognized.join(', ')}`,
      { status: 400 }
    );
  }

  const customRules = searchParams.get('customRules') || searchParams.get('rules') || '';

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
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return new NextResponse('Error generating .gitignore', { status: 500 });
  }
}


import { useMemo } from 'react';

export function useWebsiteData(htmlContent: string, contentData: any, title?: string) {
  // Extract article structure from content
  const articleStructure = useMemo(() => {
    if (contentData?.metadata?.headings && Array.isArray(contentData.metadata.headings)) {
      return contentData.metadata.headings.map((heading: any, index: number) => ({
        id: heading.id || `heading-${index}`,
        text: heading.text,
        level: heading.level,
        position: index
      }));
    }
    return [];
  }, [contentData?.metadata]);

  // Extract key metadata
  const websiteInfo = useMemo(() => {
    const metadata = contentData?.metadata || {};
    return {
      title: metadata.title || title,
      description: metadata.description,
      author: metadata.author,
      publishedDate: metadata.published || metadata.publishedAt || metadata.date,
      domain: metadata.domain || (contentData?.url ? new URL(contentData.url as string).hostname : null),
      readingTime: htmlContent ? Math.ceil(htmlContent.split(' ').length / 200) : null,
      wordCount: htmlContent ? htmlContent.split(' ').length : null
    };
  }, [contentData, title, htmlContent]);

  // Extract links
  const extractedLinks = useMemo(() => {
    if (contentData?.metadata?.links && Array.isArray(contentData.metadata.links)) {
      return contentData.metadata.links.slice(0, 8).map((link: any, index: number) => ({
        id: `link-${index}`,
        url: link.href,
        text: link.text,
        domain: (() => {
          try {
            return new URL(String(link.href)).hostname;
          } catch {
            return String(link.href);
          }
        })(),
        isExternal: !link.internal
      }));
    }
    return [];
  }, [contentData?.metadata]);

  return {
    articleStructure,
    extractedLinks,
    websiteInfo,
  };
}

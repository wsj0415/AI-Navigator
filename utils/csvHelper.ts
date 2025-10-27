import { LinkItem } from '../types';

// Note: File attachments are NOT included in the CSV export due to their size and complexity.
// Use a different format like JSON for full data backup.

export const exportCSV = (links: LinkItem[]) => {
  const header = ['id', 'url', 'title', 'description', 'topic', 'priority', 'status', 'createdAt', 'relatedLinkIds', 'attachments'];
  const rows = links.map(link =>
    header.map(fieldName => {
        const key = fieldName as keyof LinkItem;
        const value = link[key];
        if (key === 'relatedLinkIds' && Array.isArray(value)) {
            return JSON.stringify(value.join(';'));
        }
        if (key === 'attachments') { // Don't export attachment data in CSV
            return JSON.stringify(Array.isArray(value) ? value.length : 0);
        }
        return JSON.stringify(value)
    }).join(',')
  );
  return [header.join(','), ...rows].join('\n');
};


export const parseCSV = (csvText: string): LinkItem[] => {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];
    
    const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const links: LinkItem[] = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const values = lines[i].split(',');
        const linkObject: any = {};
        
        for (let j = 0; j < header.length; j++) {
            let value = values[j] || '';
            // Handle values that might be quoted
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }

            if (header[j] === 'relatedLinkIds') {
              linkObject[header[j]] = value ? value.trim().split(';') : [];
            } else if (header[j] === 'attachments') {
               linkObject[header[j]] = []; // Don't import attachment data from CSV
            } else {
              linkObject[header[j]] = value.trim();
            }
        }
        if (linkObject.id && linkObject.url && linkObject.title) {
          links.push({ attachments: [], ...linkObject } as LinkItem);
        }
    }
    return links;
};

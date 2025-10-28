import { LinkItem, Dictionaries } from '../types';

const toCsv = (headers: string[], data: any[][]): string => {
    const headerRow = headers.join(',') + '\n';
    const dataRows = data.map(row => 
        row.map(cell => {
            const str = String(cell ?? '');
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }).join(',')
    ).join('\n');
    return headerRow + dataRows;
};

export const exportLinksToCsv = (links: LinkItem[], dictionaries: Dictionaries): void => {
    const headers = ['id', 'url', 'title', 'description', 'topic', 'priority', 'status', 'createdAt', 'notes', 'relatedLinkIds'];
    
    const getLabelFromCode = (dict: keyof Dictionaries, code: string) => {
        return dictionaries[dict].find(item => item.code === code)?.label || code;
    };

    const data = links.map(link => [
        link.id,
        link.url,
        link.title,
        link.description,
        getLabelFromCode('topics', link.topic),
        getLabelFromCode('priorities', link.priority),
        getLabelFromCode('statuses', link.status),
        link.createdAt,
        link.notes || '',
        link.relatedLinkIds?.join(';') || '',
    ]);

    const csvContent = toCsv(headers, data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-t;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-nexus-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const importLinksFromCsv = (csvText: string, dictionaries: Dictionaries): Promise<LinkItem[]> => {
    return new Promise((resolve, reject) => {
        try {
            const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) return resolve([]);
            
            const headers = lines[0].split(',').map(h => h.trim());
            const data = lines.slice(1);
            
            const getCodeFromLabel = (dict: keyof Dictionaries, label: string) => {
                return dictionaries[dict].find(item => item.label.toLowerCase() === label.toLowerCase())?.code || dictionaries[dict][dictionaries[dict].length-1].code;
            };

            const links: LinkItem[] = data.map(row => {
                const values = row.split(',');
                const linkObject: { [key: string]: string } = {};
                headers.forEach((header, i) => {
                    linkObject[header] = values[i];
                });

                return {
                    id: linkObject.id || crypto.randomUUID(),
                    url: linkObject.url,
                    title: linkObject.title,
                    description: linkObject.description || '',
                    topic: getCodeFromLabel('topics', linkObject.topic || 'Other'),
                    priority: getCodeFromLabel('priorities', linkObject.priority || 'Low'),
                    status: getCodeFromLabel('statuses', linkObject.status || 'To Read'),
                    createdAt: linkObject.createdAt || new Date().toISOString(),
                    notes: linkObject.notes || '',
                    relatedLinkIds: linkObject.relatedLinkIds?.split(';').filter(id => id) || [],
                };
            });

            resolve(links.filter(l => l.url && l.title));
        } catch (error) {
            reject(error);
        }
    });
};
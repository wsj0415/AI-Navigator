import React from 'react';
import { LinkItem, Dictionaries } from '../types';
import { InformationCircleIcon, TagIcon, ClockIcon, EyeIcon } from './Icons';

interface DashboardProps {
  links: LinkItem[];
  dictionaries: Dictionaries;
  onNavigateAndFilter: (filters: { topic?: string; priority?: string; status?: string }) => void;
}

const StatCard: React.FC<{ title: string; value: number | string; children: React.ReactNode; onClick?: () => void; }> = ({ title, value, children, onClick }) => (
  <button onClick={onClick} disabled={!onClick} className={`w-full text-left bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 ${onClick ? 'hover:shadow-lg hover:-translate-y-1 hover:border-primary' : 'cursor-default'}`}>
    <div className="flex items-center gap-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
        {children}
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ links, dictionaries, onNavigateAndFilter }) => {
  const totalLinks = links.length;

  const linksByStatus = dictionaries.statuses.map(status => ({
    name: status.label,
    code: status.code,
    count: links.filter(link => link.status === status.code).length,
  }));
  
  const linksByPriority = dictionaries.priorities.map(priority => ({
    name: priority.label,
    code: priority.code,
    count: links.filter(link => link.priority === priority.code).length,
  }));

  const linksByTopic = dictionaries.topics.map(topic => ({
    name: topic.label,
    code: topic.code,
    count: links.filter(link => link.topic === topic.code).length,
  }));

  const mostRecentLink = links.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const highPriorityItem = linksByPriority.find(p => p.code === 'high');
  const toReadItem = linksByStatus.find(s => s.code === 'to-read');
  const mostCommonTopic = linksByTopic.sort((a,b) => b.count - a.count)[0];


  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Resources" value={totalLinks} onClick={() => onNavigateAndFilter({})}>
            <InformationCircleIcon className="h-6 w-6 text-blue-500" />
          </StatCard>
          <StatCard title="Most Common Topic" value={mostCommonTopic?.name || 'N/A'} onClick={mostCommonTopic ? () => onNavigateAndFilter({ topic: mostCommonTopic.code }) : undefined}>
             <TagIcon className="h-6 w-6 text-green-500" />
          </StatCard>
          <StatCard title="Highest Priority Items" value={highPriorityItem?.count || 0} onClick={() => onNavigateAndFilter({ priority: 'high' })}>
            <ClockIcon className="h-6 w-6 text-red-500" />
          </StatCard>
          <StatCard title="Items To Read" value={toReadItem?.count || 0} onClick={() => onNavigateAndFilter({ status: 'to-read' })}>
             <EyeIcon className="h-6 w-6 text-yellow-500" />
          </StatCard>
        </div>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources by Status</h3>
                <div className="space-y-3">
                {linksByStatus.map(status => (
                    <button key={status.name} onClick={() => onNavigateAndFilter({ status: status.code })} className="w-full text-left group">
                        <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-300 group-hover:text-primary">
                            <span>{status.name}</span>
                            <span>{status.count} / {totalLinks}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full group-hover:bg-primary transition-colors" style={{ width: totalLinks > 0 ? `${(status.count / totalLinks) * 100}%` : '0%' }}></div>
                        </div>
                    </button>
                ))}
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recently Added</h3>
                {mostRecentLink ? (
                    <div>
                        <a href={mostRecentLink.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline font-semibold block truncate">{mostRecentLink.title}</a>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 truncate">{mostRecentLink.description}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">{new Date(mostRecentLink.createdAt).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No resources added yet.</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
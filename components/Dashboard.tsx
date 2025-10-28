import React from 'react';
import { LinkItem, Dictionaries } from '../types';

interface DashboardProps {
  links: LinkItem[];
  dictionaries: Dictionaries;
}

const StatCard: React.FC<{ title: string; value: number | string; children: React.ReactNode }> = ({ title, value, children }) => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
        {children}
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ links, dictionaries }) => {
  const totalLinks = links.length;

  const linksByStatus = dictionaries.statuses.map(status => ({
    name: status.label,
    count: links.filter(link => link.status === status.code).length,
  }));
  
  const linksByPriority = dictionaries.priorities.map(priority => ({
    name: priority.label,
    code: priority.code,
    count: links.filter(link => link.priority === priority.code).length,
  }));

  const linksByTopic = dictionaries.topics.map(topic => ({
    name: topic.label,
    count: links.filter(link => link.topic === topic.code).length,
  }));

  const mostRecentLink = links.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const highPriorityItem = linksByPriority.find(p => p.code === 'high');
  const toReadItem = linksByStatus.find(s => s.name === 'To Read');

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Resources" value={totalLinks}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </StatCard>
          <StatCard title="Most Common Topic" value={linksByTopic.sort((a,b) => b.count - a.count)[0]?.name || 'N/A'}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v5z" /></svg>
          </StatCard>
          <StatCard title="Highest Priority Items" value={highPriorityItem?.count || 0}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </StatCard>
          <StatCard title="Items To Read" value={toReadItem?.count || 0}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </StatCard>
        </div>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources by Status</h3>
                <div className="space-y-3">
                {linksByStatus.map(status => (
                    <div key={status.name}>
                        <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-300">
                            <span>{status.name}</span>
                            <span>{status.count} / {totalLinks}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: totalLinks > 0 ? `${(status.count / totalLinks) * 100}%` : '0%' }}></div>
                        </div>
                    </div>
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

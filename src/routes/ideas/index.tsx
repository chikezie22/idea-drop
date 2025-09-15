import { createFileRoute, Link } from '@tanstack/react-router';

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { fetchIdeas } from '@/api/ideas';
import IdeaCard from '@/components/idea-card';
import type { Idea } from '@/types';

const ideaQueryOptions = () => {
  return queryOptions({
    queryKey: ['ideas'],
    queryFn: () => fetchIdeas(),
  });
};
export const Route = createFileRoute('/ideas/')({
  head: () => ({
    meta: [
      {
        title: 'IdeaDrop - Browse Ideas',
      },
    ],
  }),
  component: IdeasPage,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions());
  },
});

function IdeasPage() {
  const { data } = useSuspenseQuery(ideaQueryOptions());
  const ideas = [...data].sort((a: Idea, b: Idea) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ideas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ideas.map((idea) => (
          <IdeaCard idea={idea} />
        ))}
      </div>
    </div>
  );
}

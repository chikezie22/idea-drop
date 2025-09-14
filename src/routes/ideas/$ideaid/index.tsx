import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import { fetchidea } from '@/api/ideas';

const ideaQueryOptions = (ideaId: string) => {
  return queryOptions({
    queryKey: ['idea', ideaId],
    queryFn: () => fetchidea(ideaId),
  });
};

export const Route = createFileRoute('/ideas/$ideaid/')({
  component: IdeaDetailsPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaid));
  },
});

function IdeaDetailsPage() {
  const { ideaid } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaid));
  return (
    <div className="p-4">
      <Link to="/ideas" className="text-blue-500 underline block mb-4">
        Back to Ideas
      </Link>
      <h2 className="text-2xl font-bold">{idea.title}</h2>
      <p className="mt-2">{idea.description}</p>
    </div>
  );
}

import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { deleteIdea, fetchidea } from '@/api/ideas';

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
  const navigate = useNavigate();
  const { ideaid } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaid));
  const { mutateAsync: deleteIdeaMutate, isPending } = useMutation({
    mutationFn: () => deleteIdea(ideaid),
    onSuccess: () => {
      navigate({ to: '/ideas' });
    },
  });
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this idea?');
    console.log(idea);
    if (confirmDelete) await deleteIdeaMutate();
  };
  return (
    <div className="p-4">
      <Link to="/ideas" className="text-blue-500 underline block mb-4">
        Back to Ideas
      </Link>
      <h2 className="text-2xl font-bold">{idea.title}</h2>
      <p className="mt-2">{idea.description}</p>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-sm bg-red-600 hover:bg-red-700 text-white mt-4 px-4 py-2 rounded transition disabled:opacity-50"
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}

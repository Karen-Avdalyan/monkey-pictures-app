import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';
import { AddMonkeyModal } from '~/components/AddMonkeyModal';
import { MonkeyPictureCard } from '~/components/MonkeyPictureCard';

const IndexPage: NextPageWithLayout = () => {
  const itemsPerPage = 2;
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const monkeyPicturesQuery = trpc.monkeyPicture.list.useQuery({
    page: pageIndex,
    limit: itemsPerPage,
  });

  const removeMonkeyPicture = trpc.monkeyPicture.removeById.useMutation({
    onSuccess() {
      monkeyPicturesQuery.refetch();
    },
  });

  useEffect(() => {
    monkeyPicturesQuery.refetch();
  }, [pageIndex]);

  return (
    <div className="flex flex-col bg-gray-800">
      <div className="flex flex-col py-8 items-start gap-y-2">
        <h2 className="text-3xl font-semibold w-full mb-4 text-center">
          Monkey Pictures
          {monkeyPicturesQuery.status === 'pending' && '(loading)'}
        </h2>
        <button
          className="border border-white p-2 ml-auto mb-2"
          onClick={() => setShowAddModal(true)}
        >
          Create
        </button>
        {monkeyPicturesQuery.data && (
          <>
            <div className="flex gap-x-5 w-full">
              {monkeyPicturesQuery.data.items.map((monkeyPicture) => (
                <MonkeyPictureCard
                  key={monkeyPicture.id}
                  cardData={monkeyPicture}
                  onDeleteCard={(id) => removeMonkeyPicture.mutateAsync({ id })}
                />
              ))}
            </div>
            <div className="flex w-full gap-x-3 justify-center mt-5">
              {pageIndex > 0 && (
                <button
                  className="border border-white p-2"
                  onClick={() => setPageIndex((prev) => prev - 1)}
                  disabled={monkeyPicturesQuery.isFetching}
                >
                  Previous
                </button>
              )}
              {monkeyPicturesQuery.data.count >
                (pageIndex + 1) * itemsPerPage && (
                <button
                  className="border border-white p-2"
                  onClick={() => setPageIndex((prev) => prev + 1)}
                  disabled={monkeyPicturesQuery.isFetching}
                >
                  Next Page
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {showAddModal && (
        <AddMonkeyModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default IndexPage;

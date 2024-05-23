import { inferProcedureInput } from '@trpc/server';
import { AppRouter } from '~/server/routers/_app';
import { trpc } from '~/utils/trpc';

type AddMonkeyModalProps = {
  onClose: () => void;
};

export const AddMonkeyModal = ({ onClose }: AddMonkeyModalProps) => {
  const utils = trpc.useUtils();

  const addMonkeyPicture = trpc.monkeyPicture.add.useMutation({
    async onSuccess() {
      // refetches monkey pictures after a one is added
      await utils.monkeyPicture.list.invalidate();
      onClose();
    },
  });

  return (
    <div className="fixed top-0 left-0 w-dvw h-dvh flex items-center justify-center">
      <div
        className="fixed w-full h-full bg-zinc-700 opacity-90"
        onClick={onClose}
      />
      <div className="flex flex-col py-6 items-center z-10 bg-gray-800 rounded w-96 relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          X
        </button>
        <h2 className="text-3xl font-semibold pb-2">Add a Monkey Picture</h2>

        <form
          className="py-2 w-4/5"
          onSubmit={async (e) => {
            e.preventDefault();
            const $form = e.currentTarget;
            const values = Object.fromEntries(new FormData($form));
            type Input = inferProcedureInput<AppRouter['monkeyPicture']['add']>;
            const input: Input = {
              url: values.url as string,
              description: values.description as string,
            };
            try {
              await addMonkeyPicture.mutateAsync(input);

              $form.reset();
            } catch (cause) {
              console.error({ cause }, 'Failed to add monkey picture');
            }
          }}
        >
          <div className="flex flex-col gap-y-4 font-semibold">
            <input
              className="focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              id="url"
              name="url"
              type="text"
              placeholder="URL"
              disabled={addMonkeyPicture.isPending}
            />
            <textarea
              className="resize-none focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              id="description"
              name="description"
              placeholder="Text"
              disabled={addMonkeyPicture.isPending}
              rows={6}
            />

            <div className="flex justify-center">
              <input
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="submit"
                disabled={addMonkeyPicture.isPending}
              />
            </div>
            {addMonkeyPicture.error && (
              <p style={{ color: 'red' }}>{addMonkeyPicture.error.message}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

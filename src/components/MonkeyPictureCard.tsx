type MonkeyPictureCardProps = {
  cardData: {
    id: string;
    url: string;
    description: string;
  };
  onDeleteCard: (id: string) => void;
};

export const MonkeyPictureCard = ({
  cardData,
  onDeleteCard,
}: MonkeyPictureCardProps) => {
  return (
    <article
      key={cardData.id}
      className="w-1/2 border border-white p-2 flex flex-col"
    >
      <img className="w-full max-h-96 object-contain" src={cardData.url} />
      <p className="mt-2">{cardData.description}</p>
      <button
        className="self-end mt-auto"
        onClick={() => onDeleteCard(cardData.id)}
      >
        X
      </button>
    </article>
  );
};

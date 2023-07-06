import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { updateRessourceFn } from "../util/db";

function Favorite(props: {
  ressource: any;
  ressourceType: string;
  ressourceId: string;
}) {
  const [starIcon, setStarIcon] = React.useState<any>(regularStar);
  const { ressource, ressourceType, ressourceId } = props;

  const queryClient = useQueryClient();

  useEffect(() => {
    ressource?.data?.is_favorite
      ? setStarIcon(solidStar)
      : setStarIcon(regularStar);
  }, [ressource]);

  const updateRessourceMutation = useMutation(updateRessourceFn, {
    onMutate: async ({ type, ressource, data }: any) => {
      queryClient.setQueryData(
        [ressourceType, { [`${ressourceType}_id`]: ressourceId }],
        updateRessourceFn({ type, ressource, data })
      );
    },
  });

  const handleUpdateRessource = async ({ type, ressource, data }: any) => {
    await updateRessourceMutation
      .mutateAsync({ type, ressource, data })
      .then(() => {
        queryClient.invalidateQueries([
          ressourceType,
          { [`${ressourceType}_id`]: ressourceId },
        ]);
      });
  };
  return (
    <FontAwesomeIcon
      icon={starIcon}
      size="lg"
      style={{ cursor: "pointer" }}
      color="orange"
      onClick={() => {
        handleUpdateRessource({
          type: ressourceType,
          ressource,
          data: {
            key: "is_favorite",
            val: !ressource.data.is_favorite,
          },
        });
      }}
    />
  );
}

export default Favorite;

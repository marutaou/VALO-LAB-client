"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function FavoriteButton() {
	const [favorite, setFavorite] = useState<Boolean>(false);

	const handleClick = () => {
		favorite ? setFavorite(false) : setFavorite(true);
	};

	return (
		<button onClick={handleClick}>
			{favorite ? (
				<FontAwesomeIcon
					icon={faStar}
					className="text-xl text-yellow-300 transform hover:scale-125 duration-300"
				/>
			) : (
				<FontAwesomeIcon
					icon={faStar}
					className="text-xl transform hover:scale-125 duration-300"
				/>
			)}
		</button>
	);
}

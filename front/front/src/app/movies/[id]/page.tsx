"use client"
import React, {useEffect, useState} from 'react';

const DetailMovie = ({params} : {params : {id : string}}) => {

    const [movieId, setMovieId] = useState<string | undefined>("")

    useEffect(() => {
        setMovieId(params.id)
        alert(params.id)
    }, [params.id]);


    return (
        <div>
            <p>
                今見ている映画の詳細番号は{movieId ? movieId : ""}
            </p>
        </div>
    );
};

export default DetailMovie;
'use client'
import './movies.css'
import AllMovies from "@/app/components/allMovies/AllMovies";
//import Header from "@/app/components/header/page";

const Movies = () => {
    return (
        <>
            {/*<Header></Header>*/}
            <div id={"Movie"}>
                <h2 id={"MovieTitle"}>Movies</h2>
                <AllMovies/>
            </div>
        </>
    );
}

export default Movies;
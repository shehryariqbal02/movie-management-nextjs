import {Pagination, Container, Button} from 'react-bootstrap';
import {MediaCard} from "@/components/MediaCard/MediaCard.js";
import {ExitIcon, PlusIcon} from "@/components/Icons/Index";
import { useMovieApi } from '@/hooks/useMovie';
import {useUserApi} from "@/hooks/useAuth";
import {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import Link from "next/link";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Movies() {
    const { fetchMovies } = useMovieApi();
    const { logoutUser } = useUserApi();
    const movies = useSelector((state) => state.movies.movies);
    const [data, setData ]= useState([]);
    const [currentPage, setCurrentPage ]= useState(1);
    const limit = 8;
    const totalRecord = movies.length;
    const totalPages = Math.ceil(totalRecord/limit);
    const numLink = 3;
    const start = (currentPage - numLink) > 0 ? currentPage - (numLink -1 ): 1;
    const end = (currentPage + numLink) < totalPages ? (currentPage + numLink): totalPages;

    useEffect(() => {
        (async function() {
            await fetchMovies();
            if (movies.length > 0){
                setData(movies.slice(0,limit))
            }
        })();
    }, [movies.length]);
    useEffect(() => {
    }, [movies]);
    /**
     * Movies Pagination
     * @param pageNo
     */
    const pagination = (pageNo) => {
        setCurrentPage(pageNo);
        let offset = limit * (pageNo - 1);
        setData(movies.slice(offset, limit * (pageNo)));
    }
    return (
        <section className="movieListContainer">
            <Container>
                {
                    data.length > 0 ?
                        <>
                            <div className="d-flex justify-content-between mb-5">
                                <h2 className="pageTitle">
                                    My movies
                                    <Link href={"movies/create"}><Button className="ms-2 border-0">
                                        <PlusIcon/>
                                    </Button></Link>

                                </h2>
                                <Button className="fw-bold border-0" onClick={logoutUser}>
                                    <span className="d-none d-lg-inline">Logout</span>
                                    <span className="ms-2">
                        <ExitIcon/>
                    </span>
                                </Button>
                            </div>
                            <div className="cardContainer">
                                {data.map((item, index) => (
                                    <Link href={"/movies/edit/" + item.id} key={index}>
                                        <MediaCard key={item.id} media={item} />
                                    </Link>

                                ))}
                            </div>
                            <Pagination className="cPagination">
                                {/* Prev Button */}
                                {currentPage > 1 && (
                                    <>
                                        <Pagination.Item
                                            className="cPagination__preBtn"
                                            onClick={() => pagination(1)}
                                        >
                                            First
                                        </Pagination.Item>
                                        <Pagination.Item
                                            className="cPagination__preBtn"
                                            onClick={() => pagination(currentPage - 1)}
                                        >
                                            {"<"}
                                        </Pagination.Item>
                                    </>
                                )}

                                {/* Page Numbers */}
                                {Array.from({length: end - start + 1}, (_, index) => start + index).map(page => (
                                    <Pagination.Item
                                        key={page}
                                        className={page === currentPage ? 'active' : ''}
                                        onClick={() => pagination(page)}
                                    >
                                        {page}
                                    </Pagination.Item>
                                ))}

                                {/* Next Button */}
                                {currentPage < totalPages && (
                                    <>
                                        <Pagination.Item
                                            className="cPagination__nextBtn"
                                            onClick={() => pagination(currentPage + 1)}
                                        >
                                            {">"}
                                        </Pagination.Item>

                                        <Pagination.Item
                                            className="cPagination__preBtn"
                                            onClick={() => pagination(totalPages)}
                                        >
                                            Last
                                        </Pagination.Item>
                                    </>
                                )}
                            </Pagination>
                        </>
                        :
                        <div className="mx-auto tex text-center mb-4">
                            <h2 className="pageTitle">Your movie list is empty</h2>
                            <Link href={"movies/create"}>
                                <Button variant="secondary">Add a new movie</Button>
                            </Link>
                        </div>
                }


            </Container>

        </section>
    )
}

/**
 *
 * @param context
 * @returns {Promise<{props: {}}|{props: {get: boolean}}>}
 */
export async function getServerSideProps(context) {
    const authToken = context.req.cookies['authToken'];
    if (authToken) {
        return {
            props: {
                get: true,
            },
        };
    } else {
        context.res.writeHead(307, { Location: "/login" });
        context.res.end();
        return { props: {} };
    }
}
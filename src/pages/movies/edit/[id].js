import {DeleteIcon, UploadIcon} from "@/components/Icons/Index";
import {Button, Col, Container, Row} from "react-bootstrap";
import { useMovieApi } from '@/hooks/useMovie';
import { useEffect, useState } from 'react';
import {useDropzone} from "react-dropzone";
import { useSelector } from 'react-redux';
import Form from "react-bootstrap/Form";
import { useRouter } from 'next/router';
import {toast} from "react-toastify";
import Link from "next/link";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function EditMovie() {
    const router = useRouter();
    const { id } = router.query;
    const { fetchMovies, editMovie } = useMovieApi();
    const movies = useSelector((state) => state.movies.movies);
    const movie = movies.find((movie) => movie.id == id);

    const [name, setName] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    /**
     * image select or drop
     * @param acceptedFiles
     */
    const onDrop = (acceptedFiles) => {
        // Handle the file preview
        const file = acceptedFiles[0];
        setImagePreview(URL.createObjectURL(file));
        setImage(file)
    };
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop,
    });
    useEffect(() => {
        fetchMovies();
    }, []);
    useEffect(() => {
        if (movie) {
            setName(movie.name);
            setPublishedDate(movie.published_date);
            setImagePreview(movie.image);
        }
    }, [movie]);
    /**
     *
     * @param e
     * @returns {Promise<boolean>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('published_date', publishedDate);
        formData.append('_method', "put");
        if (image) formData.append('image', image);
        if (name === ""){
            toast.warning('Movie name is required');
            return false;
        }
        if (publishedDate === ""){
            toast.warning('Published date is required');
            return false;
        }
        if (imagePreview === null || imagePreview === ""){
            toast.warning('Movie image is required');
            return false;
        }
        const status = await editMovie(id, formData);
        if (status){
            await router.push('/movies');
        }
    };

    return (
        <div className="createMovie mb-5">
            <Container>
                <h2 className="pageTitle pb-5 mb-5">Edit</h2>
                <Row>
                    <div className="d-md-none d-block">
                        <Form.Group className="mb-4">
                            <Form.Control className="w-100" type="text" value={name} onChange={(e) => setName(e.target.value)}  placeholder="Title" />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Control className="w-100" type="number" placeholder="Publishing year" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} />
                        </Form.Group>
                    </div>
                    <Col lg={5} md={12}>
                        {!imagePreview &&
                            <div  {...getRootProps({className: 'dropzone uploadImg'})}>
                            <span className="mb-2">
                                <UploadIcon/>
                            </span>
                                <input {...getInputProps()} />
                                Drop an image here
                            </div>
                        }
                        {imagePreview && (
                            <div className='previewImg'>
                                <img src={imagePreview} alt="Preview"/>
                                <span onClick={()=> setImagePreview(null)}><DeleteIcon/></span>
                            </div>
                        )}
                    </Col>
                    <Col lg={4} md={12}>
                        <div className="d-none d-md-block">
                            <Form.Group className="mb-4">
                                <Form.Control className="w-100" type="text" value={name} onChange={(e) => setName(e.target.value)}  placeholder="Title" />
                            </Form.Group>
                            <Form.Group className="mb-5">
                                <Form.Control type="number" placeholder="Publishing year" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} />
                            </Form.Group>
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                            <Link href={'/movies'}  className="w-100">
                                <Button className="w-100" variant="primary">Cancel</Button>
                            </Link>
                            <Button className="w-100" variant="secondary" onClick={handleSubmit}>Update</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

/**
 * verify User auth
 * @param context
 * @returns {Promise<{props: {}}>}
 */
export async function getServerSideProps(context) {
    const authToken = context.req.cookies['authToken'];
    if (authToken) {
        return {
            props: {},
        };
    } else {
        context.res.writeHead(307, { Location: "/login" });
        context.res.end();
        return { props: {} };
    }
}
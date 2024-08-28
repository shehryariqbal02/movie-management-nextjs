import {Row, Col, Button,Form,Container} from 'react-bootstrap'
import {UploadIcon} from "@/components/Icons/Index";
import { useMovieApi } from '@/hooks/useMovie';
import {useDropzone} from "react-dropzone";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import { useState } from 'react';
import Link from "next/link";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function CreateMovie() {
    const { createMovie } = useMovieApi();
    const [name, setName] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const router = useRouter();
    /**
     *
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
    /**
     * Save movie function
     * @param e
     * @returns {Promise<boolean>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name === ""){
            toast.warning('Movie name is required');
            return false;
        }
        if (publishedDate === ""){
            toast.warning('Published date is required');
            return false;
        }
        if (image === null || image === ""){
            toast.warning('Movie image is required');
            return false;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('published_date', publishedDate);
        formData.append('image', image);

        const status = await createMovie(formData);
        if (status){
            router.push('/movies'); // Redirect to login if not authenticated
        }
    };
    return (
        <div className="createMovie mb-5">
            <Container>
                <h2 className="pageTitle pb-5 mb-5">Create a new movie </h2>
                <Row>
                    <Col lg={5}>
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
                            <div>
                                <img src={imagePreview} alt="Preview" style={{maxWidth: '100%', marginTop: '10px'}}/>
                                <span onClick={()=> setImagePreview(null)}>delete</span>
                            </div>
                        )}
                    </Col>

                    <Col lg={4}>
                        <Form.Group className="mb-4">
                            <Form.Control className="w-100" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Title" />
                        </Form.Group>
                        <Form.Group className="mb-5">
                            <Form.Control type="number" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} placeholder="Publishing year" />
                        </Form.Group>
                        <div className="d-flex justify-content-between gap-3">
                            <Link href={'/movies'}  className="w-100">
                                <Button className="w-100" variant="primary">Cancel</Button>
                            </Link>
                            <Button className="w-100" variant="secondary" onClick={handleSubmit}>Submit</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

/**
 *
 * @param context
 * @returns {Promise<{props: {token}}|{props: {}}>}
 */
export async function getServerSideProps(context) {
    const authToken = context.req.cookies['authToken'];
    if (authToken) {
        return {
            props: {
                token : authToken
            },
        };
    } else {
        context.res.writeHead(307, { Location: "/login" });
        context.res.end();
        return { props: {} };
    }
}
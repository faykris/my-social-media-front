import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactModal from "react-modal";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";

interface postValues {
  title: string;
  content: string;
}

interface postObject {
  _id: string,
  title: string,
  content: string,
  likes: number,
  userId: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}

const Home: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [error, setError] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const initialValues: postValues = {
    title: '',
    content: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
  });

  useEffect(() => {
    getAllPosts()
      .then((res) => {
        console.log(res)
        setPosts(res);
      })
      .catch(async (err) => {
        setError(err.response.status);
        if (err.response.status === 401) {
          await refreshToken(token);
        }
      });
  }, [token]);

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const addPost = async (values: postValues): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/post`,
        values,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}
        }
      );
      console.log('add post response:', response.data);

      getAllPosts()
        .then((res) => {
          setPosts(res);
        })
        .catch(async (err) => {
          setError(err.response.status);
          if (err.response.status === 401) {
            await refreshToken(token);
          }
        });
    } catch (error) {
      console.log('Create failed:', error);
    } finally {
      setLoading(false);
      closeModal();
    }
  }

  const refreshToken = async (token: string | null) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/refresh`,
      { refreshToken: token }
    );
    if (response.status === 201) {
      const accessToken = response.data.accessToken;
      console.log('refresh token:', response.data.accessToken)
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
    }
  }

  const getAllPosts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/post?page=1&perPage=5`,
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}
      }
    ).catch(async (err) => {
      if (err.response.status === 401) {
        await refreshToken(localStorage.getItem('token'));
      }
    });
    return response?.data;
  }

  return (
    <>
      <div className='flex justify-between bg-blue-500 p-2 align-baseline items-center'>
        <h3 className='text-cyan-50 m-0' >My Social Media</h3>
        <button onClick={onLogout} className='border-0 bg-blue-700 rounded-2xl text-cyan-100 px-3.5 py-1 hover:bg-blue-800'>
          Logout
        </button>
      </div>
      <div className='w-full flex flex-wrap justify-center px-40'>
        <div className='w-full flex justify-center items-center p-2 my-2 bg-blue-50 rounded-xl'>
          <p>What are you thinking right now?</p>
          <button
            onClick={openModal}
            className='border-0 bg-blue-700 rounded-2xl text-cyan-100 px-3.5 py-1 hover:bg-blue-800 ml-2'>
            New Post
          </button>
          <ReactModal isOpen={isOpen}>
            <p>Create Post</p>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={addPost}
            >
              <Form className="w-full">
                <div>
                  <label htmlFor="title" className="text-blue-800">Title</label>
                  <Field type="text" id="title" name="title" className="w-full h-10 rounded-full px-4" />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-right" />
                </div>
                <div>
                  <label htmlFor="content" className="text-blue-800">Content</label>
                  <Field type="text" id="content" name="content" className="w-full h-10 rounded-full px-4" />
                  <ErrorMessage name="content" component="div" className="text-red-500 text-right"/>
                </div>
                <div className="flex justify-center my-4">
                  <button
                    onClick={closeModal}
                    className='border-0 bg-blue-700 rounded-2xl text-cyan-100 px-3.5 py-1 hover:bg-blue-800 ml-2'>
                    Cancel
                  </button>
                  <button type="submit"
                          disabled={ loading }
                          className="border-0 bg-blue-700 rounded-2xl text-cyan-100 px-3.5 py-1 hover:bg-blue-800 ml-2">
                    { loading ? 'Loading': 'Save'}
                  </button>
                </div>
              </Form>
            </Formik>
          </ReactModal>
        </div>
        <div className='w-full flex justify-center bg-blue-50 px-40 my-2 rounded-xl flex-wrap'>
          { posts && posts.length > 0
            ? posts.map((post: postObject)  => (
              <div key={post._id} className='lg:w-full lg:mx-4 my-2 bg-blue-100'>
                <p>{post.title}</p>
                <p>{post.content}</p>
              </div>
            ))
            : <p className='px-5 py-10'> There is not posts yet!</p>
          }
        </div>

      </div>
    </>

  );
};

export default Home;
import React, { useState, useEffect } from "react";
import axios from "axios";

const Home: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    getAllPosts()
      .then((res) => {
        setPosts(res);
      })
      .catch(async (err) => {
          console.log('promise failed', err);

          if (err.response.status === 401) {
            const response = await axios.post(
              'https://cors-proxy-production-c13f.up.railway.app/https://my-social-media-back-production.up.railway.app/auth/refresh',
              { refreshToken: token}
            );
            if (response.status === 201) {
              console.log('refresh token:', response.data.accessToken)
              const accessToken = response.data.accessToken;

              localStorage.setItem('token', accessToken);
              setToken(accessToken);
            }
          }
      });
  }, [token]);

  const getAllPosts = async () => {
    const response = await axios.get(
      'https://cors-proxy-production-c13f.up.railway.app/https://my-social-media-back-production.up.railway.app/post?page=1&perPage=5',
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}
      }
    );
    return response.data;
  }

  return (
    <>
      <div className='flex justify-between bg-blue-500 p-2 align-baseline items-center'>
        <h3 className='text-cyan-50 m-0' >My Social Media</h3>


        <button onClick={onLogout} className='border-0 bg-blue-700 rounded-2xl text-cyan-100 px-3.5 py-1 hover:bg-blue-800'>
          Logout
        </button>
      </div>
      <div className='flex justify-center'>
        { posts.length > 0
          ? <div> { posts } </div>
          : <p className='p-5'> There is not posts yet!</p>
        }
      </div>
    </>

  );
};

export default Home;
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './LoginForm.css';
import axios from "axios";

interface LoginValues {
  email: string;
  password: string;
}

const LoginForm: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: LoginValues): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://cors-proxy-production-c13f.up.railway.app/https://my-social-media-back-production.up.railway.app/auth/login',
        values
      );
      const accessToken = response.data.accessToken;

      localStorage.setItem('token', accessToken);
      onLogin(accessToken);
    } catch (error) {
      console.log('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="Login w-full flex justify-around bg-blue-300 flex-wrap al">
    <div className="w-1/2 bg-blue-700 flex justify-center flex-wrap px-10">
      <h1 className="text-cyan-100 mt-10">
        It's time to you connect to the world
      </h1>
      <div className="h-80 w-full sm:w-2/3 lg:w-2/3 flex flex-wrap rounded-3xl bg-blue-100 p-5 m-3 shadow-xl">
        <div className= "w-full">
          <h2 className="text-3xl font-bold text-center w-full text-blue-500 mb-10">
            Login
          </h2>
        </div>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
          <Form className="w-full">
            <div>
              <label htmlFor="email" className="text-blue-800">Email</label>
              <Field type="email" id="email" name="email" className="w-full h-10 rounded-full px-4" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-right" />
            </div>
            <div>
              <label htmlFor="password" className="text-blue-800">Password</label>
              <Field type="password" id="password" name="password" className="w-full h-10 rounded-full px-4" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-right"/>
            </div>
            <div className="flex justify-center my-4">
              { loading ? <p>Loading...</p> :
                <button type="submit" className="text-blue-300 p-4 border-2 rounded-full w-1/3 border-blue-300 hover:bg-blue-700">
                  Accept
                </button>
              }
            </div>
          </Form>
        </Formik>
      </div>
    </div>

    <div className="w-1/2 bg-slate-200 login-img">

    </div>
  </div>
  );
}

export default LoginForm;

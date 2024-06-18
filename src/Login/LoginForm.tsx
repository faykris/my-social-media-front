import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './LoginForm.css';
import axios from "axios";
import ReactModal from "react-modal";

interface LoginValues {
  email: string;
  password: string;
}

interface registerValues {
  fullName: string,
  age: number | null,
  email: string;
  password: string;
  confirmPassword: string;
}

const customStyles = {
  overlay: {
    backgroundColor: 'RGBA(0,0,0, .5)',
  },
  content: {
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '80%',
    maxWidth: '30rem',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px'
  },
};

const LoginForm: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginError, setIsLoginError] = useState('');
  const [isRegisterError, setIsRegisterError] = useState('');

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };

  const initialValues1: registerValues = {
    fullName: '',
    age: null,
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const validationSchema1 = Yup.object({
    fullName: Yup.string().required('Name is required'),
    age: Yup.string().required('Age is required'),
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().required('Confirm Password is required'),
  });

  const handleSubmit = async (values: LoginValues): Promise<void> => {
    try {
      setLoading(true);
      setIsLoginError('')
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        values
      );
      const accessToken = response.data.accessToken;

      localStorage.setItem('token', accessToken);
      onLogin(accessToken);
    } catch (error: any) {
      if (error.response.data.statusCode === 401) {
        setIsLoginError("Email and/or password are incorrect");
      } else {
        setIsLoginError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (values: registerValues) => {
    const { fullName, age, email, password, confirmPassword } = values;
    try {
      setLoading(true);
      setIsRegisterError('')
      if (password === confirmPassword) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/register`,
          {fullName, age, email, password},
          {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
          }
        );
        closeModal();
      } else {
        setIsRegisterError('Password and Confirm Password must be equals');
      }
    } catch (error: any) {
      setIsRegisterError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
  <div className="Login w-full flex justify-around bg-blue-300 lg:flex-wrap flex-wrap-reverse">
    <div className="w-full lg:w-1/2 bg-blue-700 flex justify-center flex-wrap px-2 lg:px-10">
      <h1 className="text-cyan-100 mt-10">
        It's time to you connect to the world
      </h1>
      <div className="h-85 w-full sm:w-2/3 lg:w-2/3 flex flex-wrap rounded-3xl bg-blue-100 p-5 m-3 shadow-xl max-w-md">
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
            <div className="h-15">
              <label htmlFor="email" className="text-blue-800">Email</label>
              <Field type="email" id="email" name="email" className="w-full h-10 rounded-full px-4" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-right" />
            </div>
            <div className="h-15">
              <label htmlFor="password" className="text-blue-800">Password</label>
              <Field type="password" id="password" name="password" className="w-full h-10 rounded-full px-4" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-right"/>
            </div>
            <div className="h-10">
              <p className="text-red-600 text-sm text-center">
                { isLoginError || ' ' }
              </p>
            </div>
            <div className="flex justify-center my-4">
              <button type="submit"
                      disabled={ loading }
                      className="text-blue-300 p-4 border-2 rounded-full w-1/3 border-blue-300 hover:bg-blue-700 disabled:bg-gray-300">
                { loading ? 'Loading': 'Continue'}
              </button>
              <ReactModal isOpen={isOpen} style={customStyles} contentLabel="Example Modal">
                <h2 className="text-center font-bold text-2xl mb-2.5">Create User</h2>
                <Formik
                  initialValues={initialValues1}
                  validationSchema={validationSchema1}
                  onSubmit={addUser}
                >
                  <Form className="w-full">
                    <div className="input">
                      <label htmlFor="fullName" className="text-blue-800 font-bold">Name</label>
                      <Field type="text" id="fullName" name="fullName" className="w-full h-10 rounded-xl px-4 field" />
                      <ErrorMessage name="fullName" component="div" className="text-red-500 text-right" />
                    </div>
                    <div className="input mb-15">
                      <label htmlFor="age" className="text-blue-800 font-bold">Age</label>
                      <Field type="number" id="age" name="age" className="w-full h-10 rounded-xl px-4 field" />
                      <ErrorMessage name="age" component="div" className="text-red-500 text-right" />
                    </div>
                    <div className="input mb-15">
                      <label htmlFor="email-r" className="text-blue-800 font-bold">Email</label>
                      <Field type="email" id="email-r" name="email" className="w-full h-10 rounded-xl px-4 field" />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-right" />
                    </div>
                    <div className="input mb-15">
                      <label htmlFor="password-r" className="text-blue-800 font-bold">Password</label>
                      <Field type="password" id="password-r" name="password" className="w-full h-10 rounded-xl px-4 field" />
                      <ErrorMessage name="password" component="div" className="text-red-500 text-right" />
                    </div>
                    <div className="input mb-15">
                      <label htmlFor="password-c" className="text-blue-800 font-bold">Confirm Password</label>
                      <Field type="password" id="password-c" name="confirmPassword" className="w-full h-10 rounded-xl px-4 field" />
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-right" />
                    </div>
                    <div className="h-10">
                      <p className="text-red-600 text-sm">
                        { isRegisterError || ' ' }
                      </p>
                    </div>
                    <div className="flex justify-center mt-14">
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
            <div>
              <p className="text-xs my-2 text-blue-800 text-center">
                If you don't have an account, register
                <span className="hover:text-cyan-700 text-cyan-500 cursor-pointer" onClick={openModal}> here!</span>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
      <h2 className="text-cyan-100 w-full text-center mb-10">
        <span className="font-bold text-cyan-300">My Social Media</span> is a good space for that. Join us!
      </h2>
    </div>

    <div className="w-full lg:w-1/2 bg-slate-200 login-img">
    </div>
  </div>
  );
}

export default LoginForm;

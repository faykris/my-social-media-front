import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './LoginForm.css';
import axios from "axios";

interface LoginValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: LoginValues): Promise<void> => {
    try {
      const response = (await axios.post('https://my-social-media-back.vercel.app/auth/login', values));
      console.log('Login successful:', response.data);
      // Aquí puedes redirigir al usuario a otra página, guardar tokens de acceso en el almacenamiento local, etc.
    } catch (error) {
      console.log(error)
      console.error('Login failed:', error);
      // Aquí puedes manejar errores de inicio de sesión, como mostrar un mensaje al usuario
    }
  };

  return (
  <div className="flex justify-center bg-blue-100 min-h-996">
    <div className="w-1/3 flex flex-wrap rounded-3xl bg-blue-50 p-5 m-3">
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
            <label htmlFor="email">Email</label>
            <Field type="email" id="email" name="email" className="w-full h-10 rounded-full px-4" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-right" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Field type="password" id="password" name="password" className="w-full h-10 rounded-full px-4" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-right"/>
          </div>
          <div className="flex justify-center my-4">
            <button type="submit" className="text-blue-300 p-4 border-2 rounded-full w-1/3">
              Accept
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  </div>
  );
}

export default LoginForm;

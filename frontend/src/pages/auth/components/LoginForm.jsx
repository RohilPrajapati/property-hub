import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from '../api/call';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    login(values.username, values.password)
      .then((res) => {
        const { access, refresh } = res.data;
        const user = JSON.stringify(res.data.user);

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', user);
        localStorage.setItem('auth', 'true');

        notification.success({
          message: "Welcome back!",
          description: `Logged in as ${res.data.user.username}`,
          placement: 'topRight',
        });

        navigate('/');
      })
      .catch((err) => {
        console.log(err)
        const detail = err.response?.data?.detail || 'Invalid username or password.';
        notification.error({
          message: "Login Failed",
          description: detail,
          placement: 'topRight',
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-500 font-medium">Please enter your details to sign in</p>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-bold text-gray-700 ml-1">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  placeholder="e.g. johndoe"
                  className={`w-full px-5 py-3.5 rounded-2xl border bg-gray-50 outline-none transition-all duration-200
                    ${errors.username && touched.username
                      ? 'border-red-300 focus:border-red-500 ring-4 ring-red-50'
                      : 'border-gray-200 focus:border-blue-500 focus:bg-white ring-4 ring-transparent focus:ring-blue-50'
                    }`}
                />
                <ErrorMessage name="username" component="p" className="text-red-500 text-xs font-bold ml-1" />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-bold text-gray-700 ml-1">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={`w-full px-5 py-3.5 rounded-2xl border bg-gray-50 outline-none transition-all duration-200
                    ${errors.password && touched.password
                      ? 'border-red-300 focus:border-red-500 ring-4 ring-red-50'
                      : 'border-gray-200 focus:border-blue-500 focus:bg-white ring-4 ring-transparent focus:ring-blue-50'
                    }`}
                />
                <ErrorMessage name="password" component="p" className="text-red-500 text-xs font-bold ml-1" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              <p className="text-center text-sm text-gray-500 font-medium">
                Don't have an account? <span className="text-blue-600 cursor-pointer hover:underline">Contact Admin</span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
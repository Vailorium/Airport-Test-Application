import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const registerSchema = yup.object().shape({
  displayName: yup.string().required('Display Name is required').max(50, "Display Name cannot contain more than 50 characters"),
  username: yup.string().required('Username is required').max(50, "Username cannot contain more than 50 characters"),
  password: yup.string().required('Password is required').min(8, 'Password must contain atleast 8 characters'),
});

function RegisterForm(props){
  const { handleRegister, modalHide } = props;

  const [ errorMessage, setErrorMessage ] = useState("");

  return (
    <Formik
    validationSchema={registerSchema}
    onSubmit={async (values) => {
      const loggedIn = await handleRegister(values);
      if(loggedIn && modalHide) {
        modalHide();
      } else {
        setErrorMessage("Unknown error occured");
      }
    }}
    initialValues={{
      displayName: '',
      username: '',
      password: ''
    }}
    >
    {({
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      touched,
      isValid,
      errors,
    }) => (
      <>
        <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column mb-4">
          <div className="mb-4">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              name="displayName"
              value={values.displayName}
              onChange={handleChange}
              isValid={touched.displayName && !errors.displayName}
              isInvalid={!!errors.displayName}
            />
            <Form.Control.Feedback type="invalid">{errors.displayName}</Form.Control.Feedback>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
              isValid={touched.username && !errors.username}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              isValid={touched.password && !errors.password}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </div>
          <Button
            className="w-50 align-self-center"
            disabled={values.username === '' || values.password === '' || values.displayName === '' || !isValid}
            variant="primary"
            type="submit"
          >
            Register
          </Button>
        </Form>
        {
          errorMessage
          && <Alert variant='error'>
            {errorMessage}
          </Alert>
        }
      </>
    )}
  </Formik>
  )
}
export default RegisterForm;
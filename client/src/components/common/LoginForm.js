import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

function LoginForm(props){
  const { handleLogin, modalHide } = props;

  const [ errorMessage, setErrorMessage ] = useState("");

  return (
    <Formik
    validationSchema={loginSchema}
    onSubmit={async (values) => {
      const loggedIn = await handleLogin(values);
      console.log(loggedIn);
      if(loggedIn && modalHide) {
        modalHide();
      } else {
        setErrorMessage("Incorrect username or password");
      }
    }}
    initialValues={{
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
        <Form noValidate onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
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
          <Button variant="primary" type="submit">
            Login
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
export default LoginForm;
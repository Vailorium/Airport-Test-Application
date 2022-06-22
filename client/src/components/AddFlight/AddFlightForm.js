import { Field, FieldArray, Formik, getIn } from 'formik';
import React from 'react';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import SelectField from '../common/SelectField';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup';
import FlightStore from '../../stores/FlightStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const axios = require('axios').default;

const flightSchema = yup.object().shape({
  planeId: yup.number().required(),
  routes: yup.array().of(
    yup.object().shape({
      departureLocation: yup.string().required(),
      arrivalLocation: yup.string().required(),
      departureDate: yup.string().required(),
      arrivalDate: yup.string().required(),
      departureTime: yup.string().required(),
      arrivalTime: yup.string().required(),
      price: yup.number().required(),
    }),
  ).min(1),
});
class AddFlightForm extends React.Component {

  async componentDidMount() {
    await FlightStore.loadAirports();
    await FlightStore.loadPlanes();
    this.forceUpdate();
  }

  render() {
    const planeValues = FlightStore.getPlanes().sort((a, b) => a.name > b.name ? 1 : -1).map((a) => ({
      label: `${a.name} (${a.seats} Seats)`,
      value: a.id,
    }));

    const flightValues = FlightStore.getAirports().sort((a, b) => a.name > b.name ? 1 : -1).map((a) => ({
      label: `${a.name} (${a.code})`,
      value: a.code,
    }));

    return (
      <Formik
        validationSchema={flightSchema}
        onSubmit={async (values, { resetForm }) => {
          let valuesToSubmit = {
            planeId: values.planeId,
            routes: [],
          }
          for(let i = 0; i < values.routes.length; i++) {
            const route = values.routes[i];
            const departureTime = new Date(`${route.departureDate} ${route.departureTime}`).toJSON();
            const arrivalTime = new Date(`${route.arrivalDate} ${route.arrivalTime}`).toJSON();

            valuesToSubmit.routes.push({
              departureLocation: route.departureLocation,
              departureTime: departureTime,
              arrivalLocation: route.arrivalLocation,
              arrivalTime: arrivalTime,
              price: route.price * 100,
            })
          }

          await axios.post(`/flight/flights`, valuesToSubmit, { withCredentials: true })
            .then((res) => {
              if(res.status === 200) {
                // success! reset form
                resetForm();
              } else {
                console.error(res);
              }
            })
        }}
        initialValues={{
          planeId: null,
          routes: [
            {
              departureLocation: '',
              arrivalLocation: '',
              departureDate: '',
              arrivalDate: '',
              departureTime: '',
              arrivalTime: '',
              price: 0,
            },
          ]
        }}>
          {({
            handleSubmit,
            handleChange,
            values,
            isValid,
            touched,
            errors,
            setFieldValue,
          }) => (
            <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column mb-4">
              <Row>
                <Col sm="4">
                  <Form.Label>Plane</Form.Label>
                  <Field
                    name="planeId"
                    component={SelectField}
                    options={planeValues}
                    isValid={touched.departureLocation && !errors.departureLocation}
                    isInvalid={!!errors.departureLocation}
                    errorMessage={errors.departureLocation}
                    visualIndicators
                  />
                </Col>
              </Row>
              <Row className="mb-4">
                <div>
                  <FieldArray
                    name="routes"
                    render={(arrayHelpers) => (
                      <>
                        {
                          values.routes.map((r, i) => (
                            <Card className="my-2" key={`route-${i}`}>
                              <Card.Header>Route #{i + 1}</Card.Header>
                              <Card.Body>
                                <Row className="mb-2">
                                  <Col sm="6">
                                    <Form.Label>Departure Location</Form.Label>
                                    <Field
                                      name={`routes[${i}].departureLocation`}
                                      component={SelectField}
                                      options={flightValues}
                                      isValid={getIn(touched, `routes[${i}].departureLocation`) && !getIn(errors, `routes[${i}].departureLocation`)}
                                      isInvalid={!!getIn(errors, `routes[${i}].departureLocation`)}
                                      errorMessage={getIn(errors, `routes[${i}].departureLocation`)}
                                      isDisabled={i > 0}
                                      visualIndicators
                                    />
                                    <Form.Control.Feedback type="invalid">{getIn(errors, `routes[${i}].departureLocation`)}</Form.Control.Feedback>
                                  </Col>
                                  <Col sm="6">
                                    <Form.Label>Arrival Location</Form.Label>
                                    <Field
                                      name={`routes[${i}].arrivalLocation`}
                                      component={SelectField}
                                      options={flightValues}
                                      isValid={getIn(touched, `routes[${i}].arrivalLocation`) && !getIn(errors, `routes[${i}].arrivalLocation`)}
                                      isInvalid={!!getIn(errors, `routes[${i}].arrivalLocation`)}
                                      errorMessage={getIn(errors, `routes[${i}].arrivalLocation`)}
                                      onChangeEvent={(option) => { if(values.routes.length > i + 1) {
                                        setFieldValue(`routes[${i + 1}].departureLocation`, option.value);
                                      }}}
                                      visualIndicators
                                    />
                                  </Col>
                                </Row>
                                <Row className="mb-2">
                                  <Col sm="6">
                                    <Form.Label>Departure Date</Form.Label>
                                    <Form.Control
                                      name={`routes[${i}].departureDate`}
                                      type="date"
                                      value={r.departureDate}
                                      onChange={handleChange}
                                      isValid={getIn(touched, `routes[${i}].departureDate`) && !getIn(errors, `routes[${i}].departureDate`)}
                                      isInvalid={!!getIn(errors, `routes[${i}].departureDate`)}
                                    />
                                    <Form.Control.Feedback type="invalid">{getIn(errors, `routes[${i}].departureDate`)}</Form.Control.Feedback>
                                  </Col>
                                  <Col sm="6">
                                    <Form.Label>Arrival Date</Form.Label>
                                    <Form.Control
                                      name={`routes[${i}].arrivalDate`}
                                      type="date"
                                      value={r.arrivalDate}
                                      onChange={handleChange}
                                      isValid={getIn(touched, `routes[${i}].arrivalDate`) && !getIn(errors, `routes[${i}].arrivalDate`)}
                                      isInvalid={!!getIn(errors, `routes[${i}].arrivalDate`)}
                                    />
                                    <Form.Control.Feedback type="invalid">{getIn(errors, `routes[${i}].arrivalDate`)}</Form.Control.Feedback>
                                  </Col>
                                </Row>
                                <Row className="mb-2">
                                  <Col sm="6">
                                    <Form.Label>Departure Time</Form.Label>
                                      <Form.Control
                                        name={`routes[${i}].departureTime`}
                                        type="time"
                                        value={r.departureTime}
                                        onChange={handleChange}
                                        isValid={getIn(touched, `routes[${i}].departureTime`) && !getIn(errors, `routes[${i}].departureTime`)}
                                        isInvalid={!!getIn(errors, `routes[${i}].departureTime`)}
                                      />
                                      <Form.Control.Feedback type="invalid">{getIn(errors, `routes[${i}].departureTime`)}</Form.Control.Feedback>
                                  </Col>
                                  <Col sm="6">
                                    <Form.Label>Arrival Time</Form.Label>
                                      <Form.Control
                                        name={`routes[${i}].arrivalTime`}
                                        type="time"
                                        value={r.arrivalTime}
                                        onChange={handleChange}
                                        isValid={getIn(touched, `routes[${i}].arrivalTime`) && !getIn(errors, `routes[${i}].arrivalTime`)}
                                        isInvalid={!!getIn(errors, `routes[${i}].arrivalTime`)}
                                      />
                                      <Form.Control.Feedback type="invalid">{getIn(errors, `routes[${i}].arrivalTime`)}</Form.Control.Feedback>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col sm="6">
                                    <Form.Label>Price</Form.Label>
                                    <InputGroup>
                                      <InputGroup.Text>$</InputGroup.Text>
                                      <Form.Control
                                        name={`routes[${i}].price`}
                                        type="number"
                                        value={r.price}
                                        onChange={handleChange}
                                        isValid={getIn(touched, `routes[${i}].price`) && !getIn(errors, `routes[${i}].price`)}
                                        isInvalid={!!getIn(errors, `routes[${i}].price`)}
                                      />
                                      <InputGroup.Text>NZD</InputGroup.Text>
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">{getIn(errors, `routes[${i}].price`)}</Form.Control.Feedback>
                                  </Col>
                                </Row>
                              </Card.Body>
                              <Card.Footer>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => { arrayHelpers.remove(i); }}
                                  disabled={values.routes.length === 1}
                                >
                                  <FontAwesomeIcon icon="trash-alt" />
                                </Button>
                              </Card.Footer>
                            </Card>
                          ))
                        }
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            arrayHelpers.insert(values.routes.length, {
                              departureLocation: values.routes.length > 0 ? values.routes[values.routes.length - 1].arrivalLocation : '',
                              arrivalLocation: '',
                              departureDate: '',
                              arrivalDate: '',
                              departureTime: '',
                              arrivalTime: '',
                            });
                          }}
                        >
                          <FontAwesomeIcon icon="plus" /> Add Route
                        </Button>
                      </>
                    )}
                  />
                </div>
              </Row>
              <Row>
                <Col>
                  <Button
                    type="submit"
                    variant="success"
                    disabled={!isValid}
                  >
                    <FontAwesomeIcon icon="plus" /> Add Flight
                  </Button>
                </Col>
              </Row>

            </Form>
          )}
        </Formik>
    );
  }
}
export default AddFlightForm;
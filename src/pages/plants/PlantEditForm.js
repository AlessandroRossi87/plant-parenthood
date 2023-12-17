import React, { useRef, useState, useEffect } from "react";
import axios from "axios"

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/PlantCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { Image } from "react-bootstrap";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function PlantEditForm() {
  const [errors, setErrors] = useState({});

  const [plantData, setPlantData] = useState({
    title: "",
    description: "",
    image: "",
    taxonomy: [],
  });
  const [taxonomyChoices, setTaxonomyChoices] = useState([]);

  const { title, taxonomy, description, image } = plantData;

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/plants/${id}/`);
        const { title, description, image, taxonomy, is_owner } = data;

        is_owner ? setPlantData({ title, description, image, taxonomy }) : history.push("/");
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [history, id]);

  useEffect(() => {
    const fetchTaxonomyChoices = async () => {
      try {
        const response = await axios.get("api/taxonomy-choices/");
        setTaxonomyChoices([...response.data]);
      } catch (error) {
        console.error("Error fetching taxonomy choices:", error);
      }
    };

    fetchTaxonomyChoices();
  }, []); 

  const handleChange = (event) => {
    setPlantData({
      ...plantData,
      [event.target.name]: event.target.value === "taxonomy"
        ? event.target.value
        : event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      const selectedImage = event.target.files[0];
      // URL.revokeObjectURL(image);
      setPlantData({
        ...plantData,
        image: URL.createObjectURL(selectedImage),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("taxonomy_choices", taxonomy);

    if (imageInput.current.files.length) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/plants/${id}/`, formData);
      history.push(`/plants/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Taxonomy</Form.Label>
        <Form.Control
          as="select"
          name="taxonomy"
          onChange={handleChange}
        >
          <option value="">Select Taxonomy</option>
          {taxonomyChoices.map(({ value, label}, index) => (
            <option key={`${value}-${index}`} value={value}>
              {label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="description"
          value={description}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit} encType="multipart/form-data">
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PlantEditForm;
import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { FetchDataByProductId, setModal, checkStatus, Logout } from '../redux/action';

// moment.js
import Moment from 'moment';

// API
import { API_URL } from '../support/API_URL';

import LoginModal from '../components/LoginModal';

// style
import { Button } from 'semantic-ui-react';
import { Container, Row, Col } from "react-bootstrap";


const ProductDetail = props => {

  let productId = props.location.search.split('=')[1];

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(FetchDataByProductId(productId));
  }, [dispatch, productId]);
  
  const status = useSelector(({ status }) => status.status);
  const modalShow = useSelector(({ modal }) => modal.modalShow);
  const logged = useSelector(({ auth }) => auth.logged);
  const id = useSelector(({ auth }) => auth.user_id);
  const role = useSelector(({ auth }) => auth.role_id);
  const data = useSelector(({ product }) => product.productById);
  const {product_name, product_id, starting_price, seller, product_desc, category, due_date, image_path} = data;

  useEffect(() => {
    dispatch(checkStatus(id));
  }, [id]);

  useEffect(() => {
      if (status === 'Banned') dispatch(Logout());
  }, [status]);
  
  if (role === 1) {
    return <Redirect to='/internal' />
  }
  return (
    <div className="container mt-4 p-3">
      <div className="row">
        <div className="col d-flex justify-content-end">
          <img
            className="img-thumbnail"
            alt={product_name}
            src={API_URL + image_path}
            style={{ height: "33.5rem" }}
          />
        </div>
        <div className="col d-flex align-items-center">
          <Container className="img-thumbnail">
            <h2>{product_name}</h2>
            <hr />
            <br />
            <div className="container">
              <div className="row">
                <div className="col-7">
                  <h4>Starting Price</h4>
                  <h2 style={{ color: "#009C95" }}>Rp {starting_price ? starting_price.toLocaleString() : null}</h2>
                </div>
                <div className="col-5 d-flex align-items-center">
                  <Link to={`/bidding-page?product_id=${product_id}`}>
                    <Button className="ui teal button" size="lg" onClick={!logged ? () => dispatch(setModal()) : null} >Bid Now</Button>
                  </Link>
                </div>
              </div>
            </div>
            <br />
            <hr />
            <Row>
              <Col className="font-weight-bold" sm={4}>Seller</Col>
              <Col sm={8}>{seller}</Col>
            </Row>
            <hr />
            <Row>
              <Col className="font-weight-bold" sm={4}>Description</Col>
              <Col sm={8}>{product_desc}</Col>
            </Row>
            <hr />
            <Row>
              <Col className="font-weight-bold" sm={4}>Product Category</Col>
              <Col sm={8}>{category}</Col>
            </Row>
            <hr />
            <Row>
              <Col className="font-weight-bold" sm={4}>Due Date</Col>
              <Col sm={8}>{Moment(due_date).format("Do MMMM YYYY, HH:mm:ss") + " WIB"}</Col>
            </Row><br />
            <LoginModal 
              show={modalShow}
              onHide={() => dispatch(setModal())}
            />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
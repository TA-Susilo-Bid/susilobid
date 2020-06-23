import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

// API
// import Axios from 'axios';
import { API_URL } from '../support/API_URL';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { FetchProduct } from '../redux/action';

// child
import ProductPagination from "../components/ProductPagination";

// style
import { Card } from "react-bootstrap";
import Loader from 'react-loader-spinner';
import './ProductHome.css';

// sample image
import SampleImage from '../asset/SSB-1.jpeg'

const ProductHome = () => {

  const MAX_LENGTH = 75;
  const productPerPage = 8;

  const [currentPage, setCurrentPage] = useState(1);

  const getProduct = useSelector(({ product }) => product.product);
  const totalProducts = useSelector(({ product }) => product.count);
  const loading = useSelector(({ product }) => product.loading);

  const dispatch = useDispatch();

  const offset = productPerPage * (currentPage - 1);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    dispatch(FetchProduct(productPerPage, offset, 'DESC'));
  },[dispatch, currentPage, offset]);

  const renderProduct = () => {
    return getProduct.map((val, idx) => {
      return (
        <div className="col-3 mt-1" key={idx}>
          <Link to={`/product-detail?product_id=${val.product_id}`} style={{ color: "black" }}>
            <Card className="card">
              <Card.Img variant="top" src={API_URL + val.image_path} style={{ height: "12rem" }} />
              <Card.Body>
                <Card.Text>
                  {`${val.product_desc ? val.product_desc.substring(0, MAX_LENGTH).toUpperCase(): null}...`}
                </Card.Text>
                <Card.Title className="text-center" style={{ color: "#009C95" }}>Rp {val.starting_price.toLocaleString()}</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </div>
      );
    });
  };

  return (
    <div className="container">
      { loading ? (
          <div className="d-flex justify-content-center d-flex align-items-center" style={{ height: "400px" }}>
            <Loader type="Circles" color="#009C95" height={100} width={100} /> 
          </div>) :
        getProduct.length === 0 ? <p className="mt-4 ml-3">Product Not Found</p>
        :
        <>
          <div>
            <ProductPagination 
              productPerPage={productPerPage}
              totalProducts={totalProducts}
              paginate={paginate}
            />
          </div>         
          <div className="row d-flex flex-wrap mt-4">
            {renderProduct()}
          </div>
        </>
      }
    </div>
  );
};

export default ProductHome;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { FetchProductActive, FetchProductPending, FetchProductFinish } from '../redux/action';

// moment.js
import Moment from 'moment';

// child
import ProductPagination from "../components/ProductPagination";

// style
import { Tabs, Tab, Button } from 'react-bootstrap';

const Product = () => {
  const productPerPage = 8;
  
  const [status,setStatus] = useState('active')


  
  const [currentPage, setCurrentPage] = useState(1);

  const getProduct = useSelector(({ product }) => product.product);
  const totalProducts = useSelector(({ product }) => product.count);
  const sellerId = useSelector(({auth}) => auth.user_id);
  // console.log(sellerId)

  console.log(getProduct)


  const dispatch = useDispatch();
  
  const offset = productPerPage * (currentPage - 1);
  const paginate = pageNumber => setCurrentPage(pageNumber);
  

  useEffect(() => {
      if(status==='active'){
        dispatch(FetchProductActive(productPerPage, offset,sellerId));
      }
      else if(status==='pending'){
        dispatch(FetchProductPending(productPerPage, offset,sellerId));
      }
      else if(status==='finish'){
        dispatch(FetchProductFinish(productPerPage, offset,sellerId));
      }
  },[dispatch, currentPage, offset,sellerId, status]);

  // useEffect(() => {  
  //   dispatch(FetchProductActive(productPerPage, offset,sellerId));
  // },[dispatch, currentPage, offset,sellerId]);

 

  const renderProduct = () => {
    return getProduct.map((val, idx) => {
      return (<tr key={idx}>
        <td>{val.category}</td>
        <td>{val.product_name}</td>
        <td>{val.starting_price}</td>
        <td>{Moment(val.due_date).format('YYYY-MM-DD HH:mm:ss')}</td>
      </tr>
      
      )
    });
  };
console.log(getProduct);
  const renderFinishProduct = () => {
    return getProduct.map((val, idx) => {
      return (<tr key={idx}>
        <td>{val.category}</td>
        <td>{val.product_name}</td>
        <td>{val.payment_to_seller}</td>
        <td>{Moment(val.due_date).format('YYYY-MM-DD HH:mm:ss')}</td>
      </tr>
      )
    });
  };

  const renderTotal = () => {
    let total = 0
    for(let i = 0;i<getProduct.length;i++){
      total += getProduct[i].payment_to_seller
    }return total
  };

  return (
    <div className="container mt-5 p-3" style={{ width: "100%", borderRadius: 8, border: "1px solid #009C95" }}>
      <p className="h2 text-center" style={{ color: "#fff" }}>Products</p>
      <div>
        <Tabs className="mt-3" defaultActiveKey="active" onSelect={key=>setStatus(key)}>
          <Tab eventKey="active" title="Active">
                 
          <div className="row d-flex flex-wrap mt-4">
            <table class="ui single line table" style={{ marginLeft: '20px', marginRight: '20px' }}>
              <thead class="">
                <tr class="">
                  <th class="">Category</th>
                  <th class="">Product</th>
                  <th class="">Starting Price</th>
                  <th class="">Due Date</th>
                </tr>
              </thead>
              <tbody class="">
                {renderProduct()}
              </tbody>
            </table>
            
          </div>
          <div>
            <ProductPagination 
              productPerPage={productPerPage}
              totalProducts={totalProducts}
              paginate={paginate}
            />
          </div>    
          </Tab>
          <Tab eventKey="pending" title="Pending">
          <div className="row d-flex flex-wrap mt-4">
            <table class="ui single line table" style={{ marginLeft: '20px', marginRight: '20px' }}>
              <thead class="">
                <tr class="">
                  <th class="">Category</th>
                  <th class="">Product</th>
                  <th class="">Starting Price</th>
                  <th class="">Due Date</th>
                </tr>
              </thead>
              <tbody class="">
                {renderProduct()}
              </tbody>
              
            </table>
            
          </div>
          <div>
            <ProductPagination 
              productPerPage={productPerPage}
              totalProducts={totalProducts}
              paginate={paginate}
            />
          </div>    
          </Tab>
          <Tab eventKey="finish" title="Finish">
          <div className="row d-flex flex-wrap mt-4">
            <table class="ui single line table" style={{ marginLeft: '20px', marginRight: '20px' }}>
              <thead class="">
                <tr class="">
                  <th class="">Category</th>
                  <th class="">Product</th>
                  <th class="">Received</th>
                  <th class="">Finish Date</th>
                </tr>
              </thead>
              <tbody class="">
                {renderFinishProduct()}
              </tbody>
              <tfoot class="">
                <tr class="">
                  <td></td>
                  <td>Total:</td>
                  <td>{renderTotal()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            
          </div>
          <div>
            <ProductPagination 
              productPerPage={productPerPage}
              totalProducts={totalProducts}
              paginate={paginate}
            />
          </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Product;
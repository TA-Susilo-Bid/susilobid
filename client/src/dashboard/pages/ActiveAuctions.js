import React, { useState, useEffect } from 'react';

// API
import Axios from 'axios';
import { API_URL } from '../../support/API_URL';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { 
  GetCategory, 
  FetchProduct, 
  FetchDataByProductId, 
  FetchDataByCategory,
  FetchDataClose,
  FetchDataCloseCtg 
} from '../../redux/action';

// children
import ActiveAuctPagination from '../../components/ActiveAuctPagination';
import BiddingPagination from '../../components/BiddingPagination'

// style
import { Form, Row, Col, Figure, Card } from 'react-bootstrap';
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { Container, Grid, Table } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';

// others
import Moment from "moment";
import DateCountdown from "react-date-countdown-timer";

const ActiveAuctions = () => {

  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageBid, setPageBid] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [arrSocket, setArrSocket] = useState([]);
  const [totalBid, setTotalBid] = useState(0);
  const [highestBid, setHighestBid] = useState('');
  const [auct, setAuct] = useState([]);
  const [ctg, setCtg] = useState({1: 'All'});
  const [render, setRender] = useState({
    status: 'Active',
    categ: 'All'
  });
  // const [isColse, setIsClose] = useState(false);

  const dispatch = useDispatch();

  const gCategory = useSelector(({ product }) => product.category);
  const getAuct = useSelector(({ product }) => product.product);
  const totalAuct = useSelector(({ product }) => product.count);
  const gProduct = useSelector(({ product }) => product.productById);
  const loadingProduct = useSelector(({ product }) => product.loading);

  const MAX_LENGTH = 50;
  const AuctPerPage = 10;
  const bidPerPage = 5;
  const offset = AuctPerPage * (currentPage - 1);
  const offsetBid = bidPerPage * (pageBid - 1);
  const paginate = pageNumber => setCurrentPage(pageNumber);
  const paginateBid = pgNum => (setPageBid(pgNum));

  let { seller, product_desc, starting_price, invLink, invNum } = gProduct;

  useEffect(() => {
    dispatch(GetCategory());
  }, [dispatch]);

  useEffect(() => {
    let { status, categ } = render;
    if (status === 'Active' && categ === 'All') {
      dispatch(FetchProduct(AuctPerPage, offset, 'DESC'));
    } else if (status === 'Active' && categ !== 'All') {
      dispatch(FetchDataByCategory(categ));
    } else if (status !== 'Active' && categ === 'All') {
      dispatch(FetchDataClose(AuctPerPage, offset));
    } else {
      dispatch(FetchDataCloseCtg(AuctPerPage, offset, categ));
    }
  }, [dispatch, render]);
  
  useEffect(() => {
    if (gCategory) {
      setCategory(gCategory); 
      const obj = {};
      gCategory.forEach((e, i) => {
        obj[`${i+2}`] = e.category;
      });
      setCtg({...ctg, ...obj});
    }
  }, [gCategory]);

  useEffect(() => {
    if (getAuct) setAuct(getAuct);
  }, [getAuct]);

  const handleToggle = productId => {
    dispatch(FetchDataByProductId(productId));

    Axios.get(`${API_URL}/bidding/get/${productId}/${bidPerPage}/${offsetBid}`)
      .then(res => {
        setArrSocket(res.data.data);
        setHighestBid(res.data.highestBidder);
        setTotalBid(res.data.count);
      })
      .catch(err => console.log(err))

    setOpenModal(true);
    setSelectedProduct(productId);
  };

  const renderTable = () => {
    if (arrSocket.length !== 0) {
      return arrSocket.map((val, idx) => {
        return (
          <Table.Row key={idx}>
            <Table.Cell>{val.username}</Table.Cell>
            <Table.Cell>Rp {val.offer ? val.offer.toLocaleString() : null}</Table.Cell>
            <Table.Cell>{Moment(val.time).format("Do MMMM YYYY, HH:mm:ss") + " WIB"}</Table.Cell>  
          </Table.Row>
        );
      });
    } else {
      return (
        <Table.Row>
          <Table.Cell>No one has bidding yet</Table.Cell>
        </Table.Row>
      );
    }
  };
  console.log(invLink);
  const renderModal = () => {
      return (
        <Modal isOpen={openModal} toggle={() => setOpenModal(false)} size="lg" centered >
          <ModalHeader className="d-flex align-items-center" toggle={() => setOpenModal(false)}>
            <p><strong>Product Id : {selectedProduct}</strong></p>
          </ModalHeader>
          <ModalBody>
            <Table>
              <Table.Header>
                <Table.HeaderCell>Bidder</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {renderTable()}
              </Table.Body>
            </Table>
            <BiddingPagination
              bidPerPage={bidPerPage}
              totalBid={totalBid}
              paginate={paginateBid}
            />
            <hr />
          </ModalBody>
          <ModalBody >
            <Container>
              {invLink && invNum ? 
                <Row>
                  <Col className="font-weight-bold" sm={2}>Invoice</Col>
                  <Col className="font-weight-bold" sm={10}><a href={`http://localhost:2000${invLink}`} target="_blank">: {invNum}</a></Col>
                </Row>
                : null
              }
              <Row>
                <Col className="font-weight-bold" sm={2}>Seller</Col>
                <Col sm={10}>: {seller}</Col>
              </Row>
              <Row>
                <Col className="font-weight-bold" sm={2}>Starting Price</Col>
                <Col sm={10}>: Rp {starting_price ? starting_price.toLocaleString() : null}</Col>
              </Row>
              <Row>
                <Col className="font-weight-bold" sm={2}>Description</Col>
                <Col sm={10}>: {product_desc}</Col>
              </Row>
              <Row>
                <Col className="font-weight-bold" sm={2}>Highest Bidder</Col>
                <Col sm={10}>: {arrSocket.length !== 0 ? highestBid : '-'}</Col>
              </Row>
              <Row>
                <Col className="font-weight-bold" sm={2}>Total Bid</Col>
                <Col sm={10}>: {totalBid}</Col>
              </Row>
            </Container>
          </ModalBody>
        </Modal>
      );
  };

  const renderAuct = () => {
    return auct.map((val, idx) => {
      let countDown = Moment(val.due_date).format();
      return (
        <Card key={idx} className="ml-2 mt-3 img-zoom" onClick={() => handleToggle(val.product_id)}>
          <p>{val.countDown}</p>
          <p className="text-center" style={{ width: "175px", height: "60px" }}>
            <strong>Product ID {val.product_id} </strong>{render.status !== 'Close' ? <DateCountdown dateTo={countDown} /> : <p>Has expired on {Moment(val.due_date).format("Do MMMM YYYY, HH:mm:ss")} WIB</p>}
          </p>
          <Figure>
            <Figure.Image
              width={175}
              height={180}
              alt={val.product_name}
              src={API_URL + val.image_path}
            />
            <div style={{ width: "175px" }}>
              <p>{`${val.product_desc.substring(0, MAX_LENGTH)}...`}</p>
            </div>
          </Figure>
          {renderModal()}
        </Card>
      );
    });
  };

  const renderCtg = () => {
    return category.map((val, idx) => {
      return <option key={idx} value={idx + 2}>{val.category}</option>
    });
  };

  const filterByStatus = {
    1: 'Active',
    2: 'Close'
  };

  const handleMenuStatus = menu => setRender({
    ...render,
    status: filterByStatus[menu.currentTarget.value]
  });
  
  const handleMenuCtg = menu => {
    setRender({
      ...render,
      categ: ctg[menu.currentTarget.value]
    });
  }  

  return (
    <div className="mt-4 ml-5 mr-5">
      <Form >
        <Form.Group as={Row} controlId="formHorizontal">
          <Form.Label className="d-flex align-items-center font-weight-bold">
            Filter By Status
          </Form.Label>
          <Col md={2}>
            <Form.Control as="select" onChange={handleMenuStatus}>
              <option value="1">Active</option>
              <option value="2">Close</option>
            </Form.Control>
          </Col>
          <Form.Label className="d-flex align-items-center ml-4 font-weight-bold">
            Filter By Category
          </Form.Label>
          <Col md={2}>
            <Form.Control as="select" onChange={handleMenuCtg}>
              <option value="1">All</option>
              {renderCtg()}
            </Form.Control>
          </Col>
        </Form.Group>
      </Form>
      <Container className="mt-4">
        <Grid columns={5}>
          {loadingProduct ? 
            <div className="d-flex align-items-center w-100 justify-content-center" style={{ height: "400px" }}>
              <Loader type="Circles" color="#009C95" height={70} width={70} />
            </div>
          : renderAuct()}
        </Grid>
      </Container>
      <ActiveAuctPagination
        AuctPerPage={AuctPerPage}
        totalAuct={totalAuct}
        paginate={paginate}
      />
    </div>
  );
};

export default ActiveAuctions;

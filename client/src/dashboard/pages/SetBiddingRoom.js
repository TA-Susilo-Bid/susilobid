import React, { useEffect, useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { GetSubmissionAuct, ConfirmSubmission, RejectSubmission, FilterSubmissionByStatus } from "../../redux/action";

// style
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import Loader from 'react-loader-spinner';

// child
import SubmissionPagination from "../../components/SubmissionPagination";
import FilterSubmission from "../../components/FilterSubmission";

// API
import { API_URL } from '../../support/API_URL';

//moment.js
import Moment from "moment";

const SetBiddingRoom = () => {

  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [validateReject, setValidateReject] = useState(false);
  const [notes, setNotes] = useState('');
  const [render, setRender] = useState('DESC');
  
  const filterBy = {
    1: 'DESC',
    2: 'Pending',
    3: 'Confirm',
    4: 'Reject',
    5: 'ASC'
  };

  const fetchSubmission = useSelector(({ setBidding }) => setBidding.submission);
  const totalSubmission = useSelector(({ setBidding }) => setBidding.count);
  const loading = useSelector(({ setBidding }) => setBidding.loading);
  
  const dispatch = useDispatch();

  const submissionPerPage = 5;
  const offset = submissionPerPage * (currentPage - 1);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    if (render === 'DESC' || render === 'ASC') {
      dispatch(GetSubmissionAuct(submissionPerPage, offset, render));
    } else {
      dispatch(FilterSubmissionByStatus(submissionPerPage, offset, render));
    }
  }, [dispatch, currentPage, render, offset]);
  
  const handleMenuClick = menu => setRender(filterBy[menu.currentTarget.value]);

  const handleToggle = (id, product) => {
    setOpenModal(true);
    setSelectedId(id);
    setSelectedName(product);
    setValidateReject(false);
  };

  const handleConfirm = id => {
    dispatch(ConfirmSubmission(id));
    dispatch(GetSubmissionAuct(submissionPerPage, offset, render));
  };

  const handleReject = id => {
    if (!notes) {
      setValidateReject(true);
    } else {
      dispatch(RejectSubmission(id, notes));
      dispatch(GetSubmissionAuct(submissionPerPage, offset, render));
    };
  };
  console.log(fetchSubmission);
  const renderModal = () => {
    let detail = fetchSubmission.find(val => val.product_id === selectedId && val.product_name === selectedName);
    let detailArray = [];
    detailArray.push(detail);
    // console.log(detailArray)
    if (detail) {
      return(
        <div>
          <Modal isOpen={openModal} toggle={handleToggle} size="lg" centered>
            {detailArray.map((val, idx) => {
              return (
                <>
                  <ModalHeader className="d-flex align-items-center" toggle={handleToggle} key={idx}>
                    {val.product_name + ` (Product ID : ${val.product_id})`}
                  </ModalHeader>
                  <ModalBody className="row">
                    <div className="col-4">
                      <img
                        className="img-thumbnail"
                        alt={val.product_name}
                        src={API_URL + val.image_path}
                        style={{ height: "25rem" }}
                      />
                    </div>
                    <div className="col-8">
                      <Container>
                        <Row>
                          <Col sm={4}>Submission Time</Col>
                          <Col sm={8}>{Moment(val.submission_time).format("Do MMMM YYYY, HH:mm:ss") + " WIB"}</Col>
                        </Row>
                        <hr/>
                        <Row>
                          <Col sm={4}>Seller</Col>
                          <Col sm={8}>{val.seller}</Col>
                        </Row>
                        <hr/>
                        <Row>
                          <Col sm={4}>Starting Price</Col>
                          <Col sm={8}>Rp {val.starting_price.toLocaleString()}</Col>
                        </Row>
                        <hr/>
                        <Row>
                          <Col sm={4}>Description</Col>
                          <Col sm={8}>{val.product_desc}</Col>
                        </Row>
                        <hr/>
                        <Row>
                          <Col sm={4}>Product Category</Col>
                          <Col sm={8}>{val.category}</Col>
                        </Row>
                        <hr/>
                        <Row>
                          <Col sm={4}>Due Date</Col>
                          <Col sm={8}>{Moment(val.due_date).format("Do MMMM YYYY, HH:mm:ss") + " WIB"}</Col>
                        </Row>
                        <hr/>
                        <Row>
                          <Col sm={4}>Status</Col>
                          <Col sm={8}>{val.status}</Col>
                        </Row>
                        <hr/>
                        <Row>
                          <Col sm={4}>Notes</Col>
                          <Col sm={8}>
                            {!val.notes ? '-' : val.notes}
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    {
                      val.status !== 'Pending'
                      ?
                      <Button className="btn-bootstrap" onClick={handleToggle}>Close</Button>
                      :
                      <>
                        <Form>
                          {
                            validateReject 
                            ? 
                            <>
                              <Form.Control type="text" className="is-invalid" placeholder="Notes" onChange={e => setNotes(e.target.value)}/>
                              <div className="invalid-feedback">
                                Please input notes before reject the submisision
                              </div>
                            </>
                            :
                            <Form.Control type="text" placeholder="Notes" onChange={e => setNotes(e.target.value)}/>
                          }
                        </Form>
                        <Button variant="danger" onClick={() => handleReject(val.product_id)}>
                          {
                            loading
                            ?
                              <Loader type="Circles" color="#fff" height={20} width={20} />
                            :
                            'Reject'
                          }
                        </Button>
                        <Button variant="warning" onClick={() => handleConfirm(val.product_id)}>
                          {
                            loading
                            ?
                              <Loader type="Circles" color="#fff" height={20} width={20} />
                            :
                            'Confirm'
                          }
                        </Button>
                      </>
                    }
                  </ModalFooter>
                </>
              )
            })}
          </Modal>
        </div>
      );
    };
  };

  const renderTable = () => {
    return fetchSubmission.map((val, idx) => {
      return (
        <tr key={idx}>
          <td>{val.product_id}</td>
          <td>{val.product_name}</td>
          <td>{val.seller}</td>
          <td>
            {Moment(val.submission_time).format("Do MMMM YYYY, HH:mm:ss") + " WIB"}
          </td>
          <td>Rp {val.starting_price.toLocaleString()}</td>
          <td>
            <img
              src={API_URL + val.image_path}
              alt={val.image_path}
              width="120rem"
              height="90rem"
            />
          </td>
          <td>{val.status}</td>
          <td>
            <Button className="btn-bootstrap" onClick={() => handleToggle(val.product_id, val.product_name)}>
                  Details
            </Button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <FilterSubmission
        handleMenuClick={handleMenuClick}
      /> 
      <div className="d-flex justify-content-between">
        <table
          class="ui single line table"
          style={{ marginLeft: "20px", marginRight: "20px" }}
        >
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Seller</th>
              <th>Submission Time</th>
              <th>Starting Price</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              loading
                ?
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <div className="d-flex align-items-center" style={{ height: "400px" }}>
                      <Loader type="Circles" color="#009C95" height={70} width={70} />
                    </div>
                  </td>
                </tr>
                :
                renderTable()
            }
          </tbody>
        </table>
        {renderModal()}
      </div>
      <SubmissionPagination 
        submissionPerPage={submissionPerPage}
        paginate={paginate}
        totalSubmission={totalSubmission}
      />
    </div>
  );
};

export default SetBiddingRoom;
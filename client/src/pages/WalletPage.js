import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AddTopup, WalletAction, checkStatus, Logout } from '../redux/action';

// API
import Axios from 'axios';
import { API_URL } from '../support/API_URL';

// socket.io
import io from 'socket.io-client';

// style
import { Tabs, Tab, Form, Button } from 'react-bootstrap';
import { Segment } from 'semantic-ui-react';
import Loader from "react-loader-spinner";
import Swal from 'sweetalert2';

const WalletPage = () => {
  
  const dispatch = useDispatch();

  const role = useSelector(({ auth }) => auth.role_id);
  const gWallet = useSelector(state => state.wallet.wallet);
  const userId = useSelector(state => state.auth.user_id);
  const loading = useSelector(state => state.topup.loading);
  const logged = useSelector(({ auth }) => auth.logged);
  const status = useSelector(({ status }) => status.status);

  const [form, setForm] = useState('');
  const [image, setImage] = useState({
    imageName : "",
    imageFile : undefined
  });
  const [invalidForm, setInvalidForm] = useState(false);
  const [wallet, setWallet] = useState(gWallet);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    dispatch(checkStatus(userId));
  }, [userId]);

  useEffect(() => {
    if (status === 'Banned') dispatch(Logout());
  }, [status]);
  
  useEffect(() => {
    if (userId) dispatch(WalletAction(userId));

    const socket = io(API_URL);
    
    // Get wallet from admin approved
    socket.on(`Wallet-${userId}`, updateWallet);

    // Get confirmation
    socket.on(`WalletMsg-${userId}`, updateMsg);

  }, [dispatch, userId, wallet, message]);

  useEffect(() => {
    Axios.get(`${API_URL}/wallet/verification/${userId}`)
    .then(res => {
      console.log(res.data);
      // setMessage(res.data[0].messages)
    })
    .catch(e => console.log(e))
  }, []);

  useEffect(() => {
    setWallet(gWallet);
  }, [gWallet]);

  const updateWallet = wlt => setWallet(wlt);

  const updateMsg = msg => setMessage(msg);
  
  const handleChange = e => setForm(e.target.value);

  const handleImage = e => {
    // console.log(e.target.files[0]);
    if(e.target.files[0]){
      setImage({
        imageFile : e.target.files[0],
        imageName : e.target.files[0].name
      });
    } else {
      setImage({
        imageName : "",
        imageFile : undefined
      });
    }
  };

  const handleBtn = () => {
    if (!form) {
      setInvalidForm(true);
    } else if (!image.imageFile) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please upload your payment slip!'
      });
    } else {
      let formData = new FormData();
      formData.append("nominal", form);
      formData.append("slip", image.imageFile);
      setImage({
        imageName : "",
        imageFile : undefined
      });
      setForm('');
      Swal.fire({
        icon: 'success',
        title: 'Your Top-up has been sent. Please wait max 1x24 hours until our Admin verify your payment',
        showConfirmButton: false,
        timer: 1500
      })
      dispatch(AddTopup(userId, formData));
    }
  };

  const renderVerification = () => {
    if (message) {
      return message.map((val, idx) => {
        return (
          <p key={idx} style={{ color: '#009C95' }}>{val.messages}</p>
        );
      });
    }
    return <p style={{ color: '#009C95' }}>Empty</p>
  };

  if (role === 1) {
    return <Redirect to='/internal' />
  }
  if (!logged) {
    return <Redirect to='/' /> 
  }
  return ( 
    <div className="container mt-5 p-3" style={{ width: "45%", borderRadius: 8, border: "1px solid #009C95", backgroundColor: "#009C95" }}>
      <p className="h2 text-center" style={{ color: "#fff" }}>Your Wallet</p>
      <p className="h2 text-center" style={{ color: "#fff" }}>Rp {wallet.toLocaleString()}</p>
      <div>
        <Tabs className="mt-3" defaultActiveKey="top-up">
          <Tab eventKey="top-up" title="Top-up">
            <Form className="mt-4" style={{ color: "#fff" }}>
              <Form.Group>
                <Form.Label>Nominal Top-up:</Form.Label>
                {!invalidForm ? <Form.Control type="number" placeholder="Nominal" onChange={e => handleChange(e)} value={form} />
                : <Form.Control type="number" placeholder="Please input nominal Top-Up" onChange={e => handleChange(e)} isInvalid="true" />}
              </Form.Group>
              <Form.Group>
                <Form.Label>Please upload your payment slip</Form.Label>
                <Form.File onChange={handleImage} />
              </Form.Group>
            </Form>
            <div classname="d-flex justify-content-center">
              <Button variant="outline-light" type="submit" size="lg" onClick={handleBtn}>
                {
                  loading ?
                  <Loader type="Circles" color="#fff" height={20} width={60} />
                  : 'Submit'
                }
              </Button>
            </div>
          </Tab>
          <Tab eventKey="verification" title="Verification">
            <div className="mt-4">
              <Segment>
                {renderVerification()}
              </Segment>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default WalletPage;

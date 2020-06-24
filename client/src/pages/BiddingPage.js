import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";

// socket io
import io from "socket.io-client";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  FetchDataByProductId,
  WalletAction,
  checkStatus, 
  Logout
} from "../redux/action";

// API
import Axios from "axios";
import { API_URL } from "../support/API_URL";

// child
import BidPagination from "../components/BiddingPagination";

// style
import Ticker from "react-ticker";
import {
  Button,
  Container,
  Grid,
  Segment,
  Table,
} from "semantic-ui-react";
import { Input } from 'reactstrap';
// import Loader from "react-loader-spinner";
import Swal from "sweetalert2";

// moment.js
import Moment from "moment";

// react-date-countdown-timer
import DateCountdown from "react-date-countdown-timer";

const BiddingPage = (props) => {
  let productId = props.location.search.split("=")[1];

  const dispatch = useDispatch();

  const role = useSelector(({ auth }) => auth.role_id);
  const gState = useSelector(({ auth, wallet, product, serverTime, status }) => {
    return {
      username: auth.username,
      email: auth.email,
      userId: auth.user_id,
      logged: auth.logged,
      gWallet: wallet.wallet,
      productName: product.productById.product_name,
      startPrice: product.productById.starting_price,
      seller: product.productById.seller,
      productDesc: product.productById.product_desc,
      image: product.productById.image_path,
      category: product.productById.category,
      dueDate: product.productById.due_date,
      serverTime: serverTime.time,
      loadingTime: serverTime.loading,
      status: status.status
    };
  });

  let {
    username,
    email,
    gWallet,
    productName,
    startPrice,
    seller,
    productDesc,
    category,
    dueDate,
    image,
    loadingTime,
    userId,
    logged,
    status
  } = gState;

  const [input, setInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [time, setTime] = useState(null);
  const [arrSocket, setArrSocket] = useState([]);
  const [totalBid, setTotalBid] = useState(0);
  const [userInRoom, setUserInRoom] = useState([]);
  const [message, setMessage] = useState("");
  const [visibleText, setVisibleText] = useState(false);
  const [wallet, setWallet] = useState(gWallet);
  const [prevBid, setPrevBid] = useState(0);
  const [initPrice, setInitPrice] = useState(0);

  const bidPerPage = 5;
  const offset = bidPerPage * (currentPage - 1);
  const paginate = (pageNum) => setCurrentPage(pageNum);
  const countDown = Moment(dueDate).format();

  useEffect(() => {
    dispatch(FetchDataByProductId(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    dispatch(checkStatus(userId));
  }, [userId]);

  useEffect(() => {
    if (status === 'Banned') dispatch(Logout());
  }, [status]);

  useEffect(() => {
    Axios.get(`${API_URL}/bidding/get/${productId}/${bidPerPage}/${offset}`)
      .then((res) => {
        setArrSocket(res.data.data);
        setPrevBid(res.data.highest);
        setTotalBid(res.data.count);
      })
      .catch((err) => console.log(err));
  }, [currentPage, productId, offset]);

  // useEffect(() => {
  //   setInterval(() => {
  //     dispatch(GetServerTime())
  //   }, 5000)
  // },[serverTime]);

  useEffect(() => {
    const socket = io(API_URL);

    // Join room
    socket.emit("joinRoom", { username, productId });

    // Get users
    socket.on("roomUsers", ({ users }) => setUserInRoom(users));

    // Message from server
    socket.on("message", updateMsg);

    // Get data bid from server
    socket.on("Socket", updateArrSocket);

    // Server time
    socket.on("time", updateTime);

    // When unmounting the socket gets disconnected
    return () => {
      socket.disconnect();
      socket.close();
    };
  }, [username, productId]);

  useEffect(() => {
    if (userId) {
      dispatch(WalletAction(userId));
    }

    const socket = io(API_URL);

    // Get wallet from emit
    socket.on(`Wallet-${userId}`, updateWallet);
  }, [dispatch, userId, wallet]);

  useEffect(() => {
    setWallet(gWallet);
  }, [gWallet]);

  useEffect(() => {
    if (startPrice) setInitPrice(startPrice);
  }, [startPrice]);

  // ============ Running text function start here ==================

  // Asyncronous set time out function
  const p1 = (cb, msg) => {
    setTimeout(() => {
      setVisibleText(true);
      setMessage(msg);
      cb();
    }, 1000);
  };

  // Asyncronous callback to set time out function
  const p2 = () => setVisibleText(false);

  // Update message from server
  const updateMsg = (msg) => {
    if (message !== msg) {
      p1(p2, msg);
      setMessage("");
    }
  };

  const updateWallet = (wlt) => setWallet(wlt);

  const updateTime = (tm) => setTime(tm);

  // Rendering running text or hidden text
  const ticker = () => {
    if (message) {
      if (visibleText) {
        return (
          <Ticker speed={7} mode="await" direction="toRight">
            {() => <p style={{ whiteSpace: "nowrap" }}>{message}</p>}
          </Ticker>
        );
      } else {
        return (
          <Ticker speed={7} mode="await" direction="toRight">
            {() => <p style={{ visibility: "hidden" }}>{message}</p>}
          </Ticker>
        );
      }
    } else {
      return null;
    }
  };

  // ============ Running text function end here ===============

  // fetching bid data real-time from server
  const updateArrSocket = (arr) => setArrSocket(arr);

  // Add users
  const outputUsers = () => {
    return userInRoom.map((user, idx) => {
      return (
        <Segment key={idx}>
          <p>{user.username}</p>
        </Segment>
      );
    });
  };

  const handleBtn = () => {
    if (!input) {
      Swal.fire("Please input your price");
    } else {
      if (
        input < prevBid + prevBid * 0.05 ||
        input < initPrice + initPrice * 0.05
      ) {
        Swal.fire(
          "Failed",
          "please make sure that price you submit is at least 5% more than the initial price / last bidding price"
        );
      } else {
        Axios.post(
          `${API_URL}/bidding/post/${productId}/${userId}/${input}/${bidPerPage}/${offset}`
        )
          .then((res) => {
            Swal.fire("Success", res.data.status);
          })
          .catch((err) => {
            Swal.fire(err.name, err.message);
          });
      }
    }
    setInput('');
  };

  const handleChange = (e) => setInput(e.target.value);

  const renderTable = () => {
    return arrSocket.map((val, idx) => {
      return (
        <Table.Row key={idx}>
          <Table.Cell>{val.username}</Table.Cell>
          <Table.Cell>
            Rp {val.offer ? val.offer.toLocaleString() : null}
          </Table.Cell>
          <Table.Cell>
            {Moment(val.time).format("Do MMMM YYYY, HH:mm:ss") + " WIB"}
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  if (role === 1) {
    return <Redirect to='/internal' />
  } 
  if (!logged) {
    return <Redirect to='/' />
  }
  return (
    <div>
      <Container style={{ padding: "2em 0em" }}>
        <Grid columns={3}>
          <Grid.Column style={{ width: "20rem" }}>
            <Segment.Group>
              <Segment>
                <p className="h6">Your Account</p>
              </Segment>
              <Segment.Group>
                <Segment>
                  <p>{username}</p>
                </Segment>
                <Segment>
                  <p>{email}</p>
                </Segment>
              </Segment.Group>
              <Segment>
                <p className="h6">Wallet Info</p>
              </Segment>
              <Segment.Group>
                <Segment>
                  <p className="text-center">Rp. {wallet.toLocaleString()}</p>
                  <div className="d-flex justify-content-center">
                    <Link to={`/wallet?username=${username}`}>
                      <Button className="ui teal button">Top Up</Button>
                    </Link>
                  </div>
                </Segment>
              </Segment.Group>
            </Segment.Group>
            <Segment.Group>
              <Segment>
                <p className="h6">People In Room : {userInRoom.length}</p>
              </Segment>
              <Segment.Group>{outputUsers()}</Segment.Group>
            </Segment.Group>
            <Segment.Group>
              <Segment>
                <p className="h6">Server Time</p>
              </Segment>
              <Segment.Group>
                <Segment>
                  <p className="text-center">{time}</p>
                  <div className="d-flex justify-content-center">
                    <Button className="ui teal button">Reload</Button>
                  </div>
                </Segment>
              </Segment.Group>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column style={{ width: "42rem" }}>
            <p
              className="h4 font-weight-bold text-center"
              style={{ color: "#009C95" }}
            >
              Bid More ... Win More !!
            </p>
            <div>{ticker()}</div>
            <Table attached="top" basic verticalAlign="top">
              <Table.Header>
                <Table.HeaderCell>Bidder</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
              </Table.Header>
              <Table.Body>{renderTable()}</Table.Body>
            </Table>
            <div>
              <BidPagination
                bidPerPage={bidPerPage}
                totalBid={totalBid}
                paginate={paginate}
              />
            </div>
            <div className="d-flex justify-content-end">
              <p className="h6">
                End in : <DateCountdown dateTo={countDown} />
              </p>
            </div>
            <Segment.Group>
              <Segment>
                <p className="">Your Bid</p>
              </Segment>
              <Segment.Group>
                <Segment>
                  <p>
                    Before bidding, please make sure the price you enter is at
                    least 5% more than the initial price / last bidding price
                  </p>
                </Segment>
                <Segment>
                  <p>
                    After bidding, your wallet will be charged and will be
                    refunded after you lose.. LOL
                  </p>
                </Segment>
                <Segment>
                  <div className="d-flex justify-content-around">
                    <div className="d-flex align-items-center">
                      Rp
                      <Input
                        className="ml-3"
                        type="number"
                        placeholder="Input Your Price Here"
                        onChange={(e) => handleChange(e)}
                        size={20}
                        value={input}
                      />
                    </div>
                    <div>
                      <Button
                        className="ui teal button ml-5"
                        onClick={handleBtn}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </Segment>
              </Segment.Group>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column style={{ width: "20rem" }}>
            <Segment.Group>
              <Segment>
                <p className="h6">{productName}</p>
                <div>
                  <img
                    className="img-thumbnail"
                    alt={productName}
                    src={API_URL + image}
                  />
                </div>
                <p className="h6 mt-2">Product Description</p>
              </Segment>
              <Segment.Group>
                <Segment>
                  <p>{productDesc}</p>
                </Segment>
              </Segment.Group>
              <Segment>
                <div className="d-flex justify-content-between">
                  <p className="h6">Seller :</p>
                  <p>{seller}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="h6">Category :</p>
                  <p>{category}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="h6">Starting Price :</p>
                  <p>Rp {startPrice ? startPrice.toLocaleString() : null}</p>
                </div>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
};

export default BiddingPage;

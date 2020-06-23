import React, { useState, useEffect } from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import {
  GetRevenue,
  MostBidder,
  MostPopularCtg,
  TotalSell,
  WeeklyBid
} from '../../redux/action';

// chart
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-labels';

// style
import { Form, Row, Col } from 'react-bootstrap';
import { Icon, Segment } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';

const Report = () => {

  const [chartRev, setChartRev] = useState({});
  const [render, setRender] = useState("All");
  const [chartCtg, setChartCtg] = useState({});
  const [chartMostBidder, setChartMostBidder] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [month, setMonth] = useState([]);
  const [popularCtg, setPopularCtg] = useState([]);
  const [countPopCtg, setCountPopCtg] = useState([]);

  const dispatch = useDispatch();

  const gRevenue = useSelector(({ report }) => report.revenue);
  const gMonth = useSelector(({ report }) => report.month);
  const gTotalTrx = useSelector(({ report }) => report.totalTrx);
  const gPopularCtg = useSelector(({ report }) => report.popularCtg);
  const gCountCtg = useSelector(({ report }) => report.countCtg);
  const gTotalSell = useSelector(({ report }) => report.totalSell);
  const gMostBidder = useSelector(({ report }) => report.mostBidder);
  const gTotalBid = useSelector(({ report }) => report.totalBid);
  const gDay = useSelector(({ report }) => report.day);
  const gCount = useSelector(({ report }) => report.count);
  const loading = useSelector(({ report }) => report.loading);

  useEffect(() => {
    revenueChart()
  }, [gTotalBid, gCount]);

  useEffect(() => {
    ctgChart();
  }, [popularCtg, countPopCtg]);

  useEffect(() => {
    mostBidChart();
  }, [gMostBidder, gTotalBid]);

  useEffect(() => {
    dispatch(GetRevenue(render));
    dispatch(MostBidder(render));
    dispatch(MostPopularCtg(render));
    dispatch(TotalSell(render));
    dispatch(WeeklyBid(render));
  }, [render]);

  useEffect(() => {
    setRevenue(gRevenue);
    setMonth(gMonth);
  }, [gRevenue, gMonth]);

  useEffect(() => {
    setPopularCtg(gPopularCtg);
    setCountPopCtg(gCountCtg);
  }, [gPopularCtg, gCountCtg]);

  const handleMenu = menu => {
    console.log(menu.currentTarget.value);
    setRender(menu.currentTarget.value);
  };

  const renderMonth = () => {
    return month.map((val, idx) => {
      return <option key={idx} value={val}>{val} 2020</option>
    });
  };

  const ctgChart = () => {
    setChartCtg({
      labels: popularCtg,
      datasets: [
        {
          data: countPopCtg,
          backgroundColor: [
            'rgba(255, 99, 132, 1.2)',
            'rgba(54, 162, 235, 1.2)',
            'rgba(255, 206, 86, 1.2)'
          ],
          borderWidth: 1
        }
      ]
    });
  };

  const mostBidChart = () => {
      setChartMostBidder({
        labels: gMostBidder,
        datasets: [
          {
            data: gTotalBid,
            backgroundColor: [
              'rgba(75, 192, 192, 1.2)',
              'rgba(153, 102, 255, 1.2)',
              'rgba(255, 159, 64, 1.2)'
            ],
            borderWidth: 1
          }
        ]
      });
  };


  const revenueChart = () => {
    setChartRev({
      labels: gDay,
      datasets: [
        {
          data: gCount,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderWidth: 2
        }
      ]
    });
  };

  return (
    <div className="container mt-4 ml-4" style={{ height: "auto" }}>
      <div>
        <Form>
          <Form.Group as={Row}>
            <Form.Label className="d-flex align-items-center font-weight-bold">
              Sort By
            </Form.Label>
            <Col md={2}>
              <Form.Control as="select" onChange={handleMenu}>
                <option value="All">All the time</option>
                {renderMonth()}
              </Form.Control>
            </Col>
          </Form.Group>
        </Form>
      </div>
      <div>
        <Row>
          <Col sm={4}>
            { loading ? 
              <div className="d-flex align-items-center justify-content-center" style={{ height: "19rem" }}>
                <Loader type="Circles" color="#009C95" height={70} width={70} />
              </div>
            :   
            <>
              <Segment>
                <Row>
                  <Col sm={6} className="font-weight-bold">Total Transaction</Col>
                  <Col sm={6}>: Rp {gTotalTrx ? gTotalTrx.toLocaleString() : 0}</Col>
                </Row>
                <Row>
                  <Col sm={6} className="font-weight-bold">Total Revenue</Col>
                  <Col sm={6}>: Rp {revenue ? revenue.toLocaleString() : 0}</Col>
                </Row>
                <Row>
                  <Col sm={6} className="font-weight-bold">Product Sell</Col>
                  <Col sm={6}>: {gTotalSell}</Col>
                </Row>
                <Segment.Group>
                  <Segment>
                    <p className="font-weight-bold text-center">Top 3 Bidders</p>
                  </Segment>
                  <Segment.Group>
                    <Segment>
                      <Row>
                        <Col sm={6} style={{ color: 'gold' }}><Icon name='trophy' size='big' /><span className="font-weight-bold"> 1st</span></Col>
                        <Col sm={6}>: {gMostBidder[0] ? gMostBidder[0] : '-'}</Col>
                      </Row>
                      <Row className="mt-2">
                        <Col sm={6} style={{ color: 'silver' }}><Icon name='trophy' size='big' /><span className="font-weight-bold"> 2nd</span></Col>
                        <Col sm={6}>: {gMostBidder[1] ? gMostBidder[1] : '-'}</Col>
                      </Row>
                      <Row className="mt-2">
                        <Col sm={6} style={{ color: 'bronze' }}><Icon name='trophy' size='big' /><span className="font-weight-bold"> 3rd</span></Col>
                        <Col sm={6}>: {gMostBidder[2] ? gMostBidder[2] : '-'}</Col>
                      </Row>
                    </Segment>
                  </Segment.Group>
                </Segment.Group>
              </Segment>
            </>
            }
          </Col>
          <Col sm={4}>
            { loading ? 
              <div className="d-flex align-items-center justify-content-center" style={{ height: "19rem" }}>
                <Loader type="Circles" color="#009C95" height={70} width={70} />
              </div>
            :   
              <Pie 
                data={chartMostBidder}
                widht={100}
                height={180}
                options={{
                  maintainAspectRatio: false,
                  title: { text: 'Top 3 Bdders', display: true },
                  plugins:{
                    labels: {
                      render: 'value',
                      fontSize: 14,
                      fontStyle: 'bold',
                      fontColor: '#fff',
                      fontFamily: '"Lucida Console", Monaco, monospace'
                    }
                  }
                }}
              />
            }
          </Col>
          <Col sm={4}>
            { loading ? 
              <div className="d-flex align-items-center justify-content-center" style={{ height: "19rem" }}>
                <Loader type="Circles" color="#009C95" height={70} width={70} />
              </div>
            :   
              <Doughnut
                data={chartCtg}
                width={100}
                height={280}
                options={{
                  maintainAspectRatio: false,
                  title: { text: 'Top 3 Bidding Category', display: true },
                  plugins: {
                    labels: {
                      render: 'value',
                      fontSize: 14,
                      fontStyle: 'bold',
                      fontColor: '#fff',
                      fontFamily: '"Lucida Console", Monaco, monospace'
                    }
                  }
                }}
              />
            }
          </Col>
        </Row>
      </div>
      <div className="container mt-3">
        { loading ? 
          <div className="d-flex align-items-center justify-content-center" style={{ height: "30rem" }}>
            <Loader type="Circles" color="#009C95" height={70} width={70} />
          </div>
        :   
          <Bar
            data={chartRev}
            width={70}
            height={400}
            options={{
              maintainAspectRatio: false,
              legend: {display: false},
              title: { text: 'Weekly Bid', display: true },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 5,
                      beginAtZero: true
                    },
                    gridLines: {
                      display: false
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Total Bid'
                    }
                  }
                ]
              },
              plugins: {
                labels: {
                  render: 'value',
                  fontSize: 10,
                  fontStyle: 'bold',
                  fontColor: 'rgb(0, 22, 40)',
                  fontFamily: '"Lucida Console", Monaco, monospace'
                }
              }
            }}
          />
        }
      </div>
    </div>
  );
};

export default Report;

import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import axios from "axios";
import moment from "moment";
import "../styles/housing.css";

const quarter =
  moment().quarter() < 3
    ? "" + (moment().year() - 1) + "-Q" + (moment().quarter() + 2)
    : "" + moment().year() + "-Q" + (moment().quarter() - 2);

let q = quarter.slice(0,4);
let limit = 1;
const apiUrl =
  "https://data.gov.sg/api/action/datastore_search?resource_id=a5ddfc4d-0e43-4bfe-8f51-e504e1365e27";

const colors = scaleOrdinal(schemeCategory10).range();

const getPath = (x, y, width, height) => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y +
  height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y +
  height} ${x + width}, ${y + height}
          Z`;

const TriangleBar = props => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

TriangleBar.propTypes = {
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number
};

class Housing extends Component {
  state = {
    data: []
  };

  constructor() {
    super();
    this.fetchData();
  }

  fetchData() {
    axios
      .get(apiUrl, {
        params: {
          limit,
          q
        }
      })
      .then(res => {
        limit = res.data.result.total;
        axios
          .get(apiUrl, {
            params: {
              limit,
              q
            }
          })
          .then(res => {
            const dataWithDuplicate = res.data.result.records
                .filter(
                  r => r.quarter === quarter && r.flat_type === "3-ROOM" && !["na", "-"].includes(r.price)
                )
                .map(r => {
                  console.log(r);
                  r.price = parseFloat(r.price);
                  return r;
                });
            this.setState({
              data: dataWithDuplicate.slice(0, dataWithDuplicate.length/2)
            });
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { data } = this.state;

    return (
      <>
        <Head>
          <title>Housing</title>
        </Head>

        <div className="housing">
          <h3 className="title">Median HDB Resale Prices ({quarter})</h3>
          {data.length ? (
            <BarChart
              className="center"
              width={1200}
              height={600}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="town"
                tick={{ angle: -45 }}
                interval={0}
                textAnchor="end"
                height={150}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="price"
                fill="#8884d8"
                shape={<TriangleBar />}
                label={{ position: "top" }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % 10]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
}

export default Housing;

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

let limit = 1;
let q = moment().year() + "-Q" + (moment().quarter() - 2);
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
            this.setState({
              data: res.data.result.records
                .filter(
                  r =>
                    r.flat_type === "3-ROOM" && !["na", "-"].includes(r.price)
                )
                .map(r => {
                  r.price = parseFloat(r.price);
                  return r;
                })
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

        <h3 style={{ textAlign: "center" }}>Median HDB Resale Prices ({q})</h3>
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
      </>
    );
  }
}

export default Housing;

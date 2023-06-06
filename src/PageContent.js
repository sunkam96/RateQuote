import React, { useState } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {faker} from '@faker-js/faker';
import { useForm } from "react-hook-form";
import './PageContent.css';
import { usePapaParse } from 'react-papaparse';
import Papa from "papaparse";
import FipsCodeToLoanLimitMap from './FipsCodeToLoanLimitMap.json';
import ZipToFipsMap from './ZipToFipsMapSeparated.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'RateQuote interest rates',
      },
    },
  };
  
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Rocket Mortgage',
            data: labels.map((ele, idx) => 0.1*(idx + Math.random())),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'AT Lending',
            data: labels.map((ele, idx) => 0.1*(idx + Math.random())),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Caliber',
            data: labels.map((ele, idx) => 0.1*(idx + Math.random())),
            borderColor: 'rgb(255,255,0)',
            backgroundColor: 'rgb(255,255,0, 0.5)',
        },
    ],
};


function PageContent(){
    const initialData = {
        'interestRate': 4.15,
        'loanAmount': 500000,
        'loanTerm': "30yr-26yr",
        'ficoScore': 750,
        'zipcode': 11211,
        'showLoanLimit': false,
        'county': null,
        'state': null,
        'loanLimit': null,
    }
    const [data, setData] = useState(initialData);
    return (
        <div className="page-content">
            <h3>Calculate your rates</h3>
            {/* <Form setData={setData}/> */}
            {/* <Quotes data={data} /> */}
        </div>
    )
}

function Form(props) {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data, e) => {
        e.preventDefault(); 
        const updateData = {
            'interestRate': data["interestRate"],
            'loanAmount': data["loanAmount"],
            'loanTerm': data["loanTerm"],
            'ficoScore': data["ficoScore"],
            'zipcode': data["zipcode"],
            'showLoanLimit': false,
            'county': null,
            'state': null,
            'loanLimit': null,
        }

        if(ZipToFipsMap.hasOwnProperty(data["zipcode"])){
            updateData['showLoanLimit'] = true;
            const fipsCodeData = ZipToFipsMap[data["zipcode"]];
            const fipsCode = fipsCodeData["fips"];
            updateData['county'] = fipsCodeData["County"];
            updateData['state'] = fipsCodeData["State"];
            const loanLimitData = FipsCodeToLoanLimitMap[fipsCode];
            updateData['loanLimit'] = loanLimitData["LoanLimit"];
        }
        else {
            updateData["zipcode"] = "Invalid zip code provided";
        }
        
        props.setData(updateData);
        console.log("on submit finished");
    };
    const onError = (errors, e) => {
        console.log("on error was called");
        console.log(errors);
    };
    return (
        <div className="form-container">
            <div className="signup-form">
                <div className="signup-form-header">
                    Calculate your rate
                </div>
                <div>
                    <form id="form" onSubmit={handleSubmit(onSubmit, onError)}>
                        <div className="input-form-group">
                            <div className="input-form-group-row">
                                <label for="interestRate">Interest Rate:</label>
                                <input {...register("interestRate")} type="number" step="0.01" className="form-control-sm" id="interestRate" placeholder="Interest Rate"/> 
                            </div>
                            <div className="input-form-group-row">
                                <label for="loanAmount">Loan Amount:</label>
                                <input {...register("loanAmount")} type="number" className="form-control-sm" id="loanAmount" placeholder="Loan Amount"/>
                            </div>
                            <div className="input-form-group-row">
                                <label for="loanTerm">Loan Term:</label>
                                <select name="loanTerm" {...register("loanTerm")}  className="form-control-sm" id="loanTerm" form="form">
                                <option value="30yr-26yr">30yr-26yr</option>
                                <option value="25yr-21yr">25yr-21yr</option>
                                <option value="20yr-16yr">20yr-16yr</option>
                                <option value="15yr-11yr">15yr-11yr</option>
                                <option value="10yr-8yr">10yr-8yr</option>
                                </select>
                            </div>
                            <div className="input-form-group-row">
                                <label for="ficoScore">FICO Score:</label>
                                <input {...register("ficoScore")} type="number" className="form-control-sm" id="ficoScore" placeholder="FICO Score"/>
                            </div>
                            <div className="input-form-group-row">
                                <label for="zipcode">Zipcode:</label>
                                <input {...register("zipcode")} type="number" className="form-control-sm" id="zipcode" placeholder="Zipcode"/>
                            </div>
                        </div>
                        <br/>
                        <button type="submit" className="btn btn-primary">Calculate</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
  

function Quotes(props) {
    return (
        <div className="quote-container">
            <div className="quote-container-header">
                Your quotes
            </div>
            <div className="quote-container-chart">
                <Line options={options} data={data} />
            </div>
            <div className="quote-container-fields">
                <div><b>Rate estimate terms</b></div>
                <div>Rate: {props.data.interestRate}</div>
                <div>Rocket Mortgage Points: {undefined}</div>
                <div>AT Lending Points: {undefined}</div>
                <div>Caliber Points: {undefined}</div>
                <div>Loan amount: {props.data.loanAmount}</div>
                <div>Loan term: {props.data.loanTerm} </div>
                <div>FICO score: {props.data.ficoScore} </div>
                <div>Zipcode: {props.data.zipcode}</div>
                {props.data.showLoanLimit && <div>County: {props.data.county}</div>}
                {props.data.showLoanLimit && <div>State: {props.data.state}</div>}
                {props.data.showLoanLimit && <div>County Loan Limit: {props.data.loanLimit}</div>}
            </div>
        </div>
    )
}






export default PageContent;
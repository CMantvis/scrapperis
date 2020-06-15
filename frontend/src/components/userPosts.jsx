import React, { useState, useEffect } from 'react';
import axios from "axios";
const cvmarketLogo = require("./logos/logo.PNG");
const cvonlineLogo = require("./logos/cvonline.PNG");
const cvbankasLogo = require("./logos/cvBankaslogo.svg")

export default function UserPosts() {

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token")
        axios.get("https://mysterious-journey-11608.herokuapp.com/api/favorites")
        .then(rez => {
            rez.data.map(item => {
                if (item.searchedSite === "https://www.cvbankas.lt") {
                    item.logo = cvbankasLogo;
               } else if (item.searchedSite === "https://www.cvonline.lt") {
                   item.logo = cvonlineLogo;
               } else if (item.searchedSite === "https://www.cvmarket.lt") {
                    item.logo = cvmarketLogo;
               }
               return item
            })
            setFavorites(rez.data)
        })
    }, []);

    return (
        <>
            {
                favorites.length === 0 ? <div>hello</div> : favorites.map((job, index) => (
                    <div className="job-container" key={job._id} >
                        <div className="job-row1">
                            <a className="job-title" href={job.jobUrl}><h5>{job.jobTitle}</h5></a>
                            <p className="job-city">{job.city}</p>
                            <p className="job-date">Prideta: {job.postDate}</p>
                        </div>
                        <div className="job-row2">
                            <p className="job-company">{job.companyName}</p>
                            <img className="job-logo" src={job.logo} alt="searched site logo" />
                        </div>
                        <div className="job-row3">
                        <p className="job-salary">{job.salaryAmount === "Alga nenurodyta"? "Alga nenurodyta": `${job.salaryAmount} eur`} </p>
                            <p className="job-site">{job.searchedSite}</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

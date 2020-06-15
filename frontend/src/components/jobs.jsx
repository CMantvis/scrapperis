import React, { useState, useEffect } from 'react';
import axios from "axios";
import ListGroup from './listGroup';
import JobForm from './jobForm';
const cvmarketLogo = require("./logos/logo.PNG");
const cvonlineLogo = require("./logos/cvonline.PNG");
const cvbankasLogo = require("./logos/cvBankaslogo.svg")

export default function Jobs({ user }) {

    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [selectedSite, setSelectedSite] = useState("All sites");
    const [searchedSites, setSearchedSites] = useState([]);
    const [loading, setLoading] = useState(false);

    //function to find all unique searched sites
    useEffect(() => {

        const handleSearched = array => {
            let arr;

            if (jobs.length === 0) {
                arr = [];
            } else {
                arr = ["All sites"];
            }

            for (let i = 0; i < array.length; i++) {
                if (!arr.includes(array[i].searchedSite)) {
                    arr.push(array[i].searchedSite);
                }
            }
            return arr;
        };
        setSearchedSites(handleSearched(jobs));
    }, [jobs]);
    //

    const handleChange = e => {
        setKeyword(e.target.value);
    };

    const handleSiteSelect = site => {
        setSelectedSite(site);
    };

    const handleLike = id => {
        setJobs([...jobs.map(item => {
            if (item._id === id) {
                item.liked = !item.liked
            }
            return item
        })]);

        jobs.map(item => {
            if (item._id === id) {
                if (!item.liked) {
                    axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
                    axios.delete(`https://mysterious-journey-11608.herokuapp.com/api/favorites/unlike/${id}`)
                } else if (item.liked) {
                    axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token")
                    axios.post("https://mysterious-journey-11608.herokuapp.com/api/favorites/like", {
                        id: id
                    })
                }
            }
        })
    };

    // Site filtering
    let filtered;
    if (selectedSite === "All sites") {
        filtered = jobs;
    } else {
        filtered = selectedSite ? jobs.filter(j => j.searchedSite === selectedSite) : jobs
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
        if (user) {
            axios.post("https://mysterious-journey-11608.herokuapp.com/api/jobs", {
                keyword: keyword
            })
                .then(() => axios.get(`https://mysterious-journey-11608.herokuapp.com/api/jobs/auth/${keyword}`))
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
                    setJobs(rez.data)
                })
                .then(() => setLoading(false))
        } else {
            axios.post("https://mysterious-journey-11608.herokuapp.com/api/jobs", {
                keyword: keyword
            })
                .then(() => axios.get(`https://mysterious-journey-11608.herokuapp.com/api/jobs/${keyword}`))
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
                    setJobs(rez.data)
                })
                .then(() => setLoading(false))
        }
        setKeyword("");
    };

    return (
        <>
            <JobForm
                onSubmit={handleSubmit}
                type="text"
                value={keyword}
                names="keyword"
                onChange={handleChange}
                placeholder="Keyword"
            />
            <h3 className="job-length">{filtered.length > 0 ? `${filtered.length} jobs found` : null}</h3>

            <div className="main-container">
                <div className="search-filter">
                    <ListGroup items={searchedSites}
                        onItemSelect={handleSiteSelect}
                        selectedItem={selectedSite}
                    />
                </div>
                {loading ? <h3 className="loading">Scrapping data, this might take a couple second .....</h3> : null}
                {
                    jobs.length === 0 && loading === false ? <h3 className="guide">Enter the keyword to find jobs from all the supported Sites</h3> : filtered.map(job => (
                        <div className="job-container" key={job._id} >
                            <div className="job-row1">
                                <a className="job-title" href={job.jobUrl}><h5>{job.jobTitle}</h5></a>
                                <p className="job-city">{job.city}</p>
                                <p className="job-date">Prideta: {job.postDate}</p>
                                {user && <i className={job.liked ? "fas fa-star fa-lg" : "far fa-star fa-lg"} onClick={() => handleLike(job._id)}></i>}
                            </div>
                            <div className="job-row2">
                                <p className="job-company">{job.companyName}</p>
                                <img className="job-logo" src={job.logo} alt="searched site logo" />
                            </div>
                            <div className="job-row3">
                                <p className="job-salary">{job.salaryAmount === "Alga nenurodyta" ? "Alga nenurodyta" : `${job.salaryAmount} eur`} </p>
                                <p className="job-scrape-date">{job.dateScrapped.slice(0, 10)}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

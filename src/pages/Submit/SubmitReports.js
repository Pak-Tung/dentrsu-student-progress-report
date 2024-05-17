import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function SubmitReports() {
  return (
    <div>
      <div>
        <nav className="navbar navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
            <button
              className="navbar-brand"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                cursor: "pointer",
                outline: "inherit",
              }}
            >
              Offcanvas dark navbar
            </button>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasDarkNavbar"
              aria-controls="offcanvasDarkNavbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="offcanvas offcanvas-end text-bg-dark"
              tabindex="-1"
              id="offcanvasDarkNavbar"
              aria-labelledby="offcanvasDarkNavbarLabel"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                  Dark offcanvas
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                  <li className="nav-item">
                    <button className="nav-link active" aria-current="page">
                      Home
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" type="button">
                      Link
                    </button>
                  </li>
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Dropdown
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark">
                      <li>
                        <button className="dropdown-item" onClick={() => {}}>
                          Action
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => {}}>
                          Another action
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => {}}>
                          Something else here
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
                <form className="d-flex mt-3" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button className="btn btn-success" type="submit">
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="container text-center">
        <h1>Submit Requirements</h1>
        <div className="d-grid gap-2 col-6 mx-auto">
          <button type="button" className="btn btn-primary btn-lg">
            Complete Cases
          </button>
          <button type="button" className="btn btn-primary btn-lg">
            Prosthodontics
          </button>
          <button type="button" className="btn btn-primary btn-lg">
            Operative
          </button>
          <button type="button" className="btn btn-primary btn-lg">
            Periodontics
          </button>
          <button type="button" className="btn btn-primary btn-lg">
            Endodontics
          </button>
          <button type="button" className="btn btn-primary btn-lg">
            Oral Diagnosis
          </button>
          <button type="button" className="btn btn-primary btn-lg">
            Radiology
          </button>
          <button type="button" className="btn btn-primary btn-lg">
            Oral Surgery
          </button>
          <button type="button" className="btn btn-primary btn-lg">
            Orthodontics
          </button>
          <button type="button" className="btn btn-primary btn-lg">
            Pediatric Dentistry
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitReports;

import React from "react";
import "../styles/test.css";

const Test = () => {
  return (
    <div class="sidebar">
      <div class="top-icon">
        <img src="/path/to/leaf-icon.svg" alt="Leaf" />
      </div>
      <nav>
        <ul>
          <li>
            <a href="#">
              <i class="icon-home"></i>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="icon-measure"></i>
              <span>Measure</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="icon-analyze"></i>
              <span>Analyze</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="icon-reduce"></i>
              <span>Reduce</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="icon-report"></i>
              <span>Report</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Test;

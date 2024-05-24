import React from "react";
import Mesh from "./assets/mesh.png";
import KlatyEducate from "./assets/Klaytn_Event.jpg";
import "./Carousel.css";

export default function Carousel() {
  return (
    <div
      id="carouselExampleDark"
      class="carousel carousel-dark slide"
      data-bs-ride="carousel"
    >
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="10000">
          <img src={Mesh} class="d-block w-100" alt="..."></img>
          <div class="carousel-caption d-none d-md-block">
            <h5>Klaytn</h5>
            <p>Want to learn more about Klaytn?</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="2000">
          <img src={KlatyEducate} class="d-block w-100" alt="..."></img>
          <div class="carousel-caption d-none d-md-block">
            <h5>Klaytn Educate Series</h5>
            <p>Want to learn more about the world of Web3?</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src={Mesh} class="d-block w-100" alt="..."></img>
          <div class="carousel-caption d-none d-md-block">
            <h5>Third slide label</h5>
            <p>Some representative placeholder content for the third slide.</p>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleDark"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleDark"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  );
}

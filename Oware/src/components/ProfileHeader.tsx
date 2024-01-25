import React from 'react'
import '../css/ProfileHeader.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import player from '../assets/images/player.png'
import coin from '../assets/images/coin.png'
import { Link  } from 'react-router-dom';
import '../css/item.css'
import creator from '../assets/images/player.png'
import item from '../assets/images/item.jfif'
const ProfileHeader = () => {
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide:true,
    responsive: [
      {
        breakpoint: 1160,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        }
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 470,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          variableWidth: true,
        }
      }
    ]
  };
  return (
    <>
    <div className='item section__padding'>
        <div className="item-image">
          <img src={item} alt="item" />
        </div>
          <div className="item-content">
            <div className="item-content-title">
              <h1>Abstact Smoke Red Blue</h1>
              <p>From <span>4.5 ETH</span> ‧ 20 of 25 available</p>
            </div>
            <div className="item-content-creator">
              <div><p>Creater</p></div>
              <div>
                <img src={creator} alt="creator" />
                <p>Rian Leon </p>
              </div>
            </div>
            <div className="item-content-detail">
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
            </div>
            <div className="item-content-buy">
              <button className="primary-btn">Buy For 4.5 ETH</button>
              <button className="secondary-btn">Make Offer</button>
            </div>
          </div>
      </div>
    <div className='headerProfile section__padding'>
      <div className="headerProfile-content">
        <div>
          <h1>Play, Win, collect, and Redeem extraordinary NFTs</h1>
          <img className='shake-vertical' src={coin} alt="" />
        </div>
      </div>
      <div className="headerProfile-slider">
        <h1>Top Players</h1>
       <Slider {...settings} className='slider'>
            <div className='slider-card'>
              <p className='slider-card-number'>1</p>
              <div className="slider-img">
                <img src={player} alt="" />

              </div>
              <Link to={`/profile/Rian`}>
              <p className='slider-card-name'>James Bond</p>
              </Link>
              <p className='slider-card-price'>5.250 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>2</p>
              <div className="slider-img">
                <img src={player} alt="" />

              </div>
              <Link to={`/profile/Rian`}>
              <p className='slider-card-name'>Rian Leon</p>
              </Link>
              <p className='slider-card-price'>4.932 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>3</p>
              <div className="slider-img">
                <img src={player} alt="" />
              </div>
              <Link to={`/profile/Rian`}>
              <p className='slider-card-name'>Lady Young</p>
              </Link>
              <p className='slider-card-price'>4.620 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>4</p>
              <div className="slider-img">
                <img src={player} alt="" />
              </div>
              <Link to={`/profile/Rian`}>
              <p className='slider-card-name'>Black Glass</p>
              </Link>
              <p className='slider-card-price'>4.125 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>5</p>
              <div className="slider-img">
                <img src={player} alt="" />
              </div>
              <Link to={`/profile/Rian`}>
              <p className='slider-card-name'>Budhiman</p>
              </Link>
              <p className='slider-card-price'>3.921 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>6</p>
              <div className="slider-img">
                <img src={player} alt="" />
              </div>
              <Link to={`/profile/Rian`}>
              <p className='slider-card-name'>Alex</p>
              </Link>
              <p className='slider-card-price'>3.548 <span>ETH</span></p>
            </div>
        </Slider>
      </div>
    </div>
    </>
  )
}

export default ProfileHeader;
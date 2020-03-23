import React, { Component } from "react";

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from "reactstrap";

const items = [
  {
    id: 1,
    src: 'assets/img/slider/background1.jpg',
    altText: "Slide 1",
    caption: "Strengthen our Trust in Charity",
    subCaption:"The Best Solution for Donation",
    title:"TransACT"
  },
  {
    id: 2,
    src: 'assets/img/slider/background2.jpg',
    altText: "Slide 2",
    caption: "Full Assurance of Transparency Realized through Blockchain Technology",
    subCaption:"Check Money Flow Whenever You Want",
    title:"TransACT"
  },
  {
    id: 3,
    src: 'assets/img/slider/background3.jpg',
    altText: "Slide 3",
    caption: "Ensure Money Flow in Correct Way",
    subCaption:"Let Charity Really Helps",
    title:"TransACT"
  }
];

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      animating: false
    };
  }

  next = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  };

  previous = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? items.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  };

  goToIndex = newIndex => {
    if (this.state.animating) return;
    this.setState({ activeIndex: newIndex });
  };

  render() {
    return (
      <div>
        <style>
          {`.custom-tag {
              max-width: 100%;
              height: 30rem;
              background: black;
            }`}
        </style>
        <Carousel
          activeIndex={this.state.activeIndex}
          next={() => this.next()}
          previous={() => this.previous()}
          interval="1500"
        >
          <CarouselIndicators
            items={items}
            activeIndex={this.state.activeIndex}
            onClickHandler={ activeIndex => this.goToIndex(activeIndex)}
          />
          {items.map(item => {
            return (
              <CarouselItem
                className="custom-tag"
                tag="div"
                key={item.id}
                onExiting={() => this.setState({ animating: true })}
                onExited={() => this.setState({ animating: false })}
              >
                <img src={item.src} alt={item.altText} style={{opacity:0.5, width:"100%", height: "100%"}}/>
                <div style={{ width:"100%", position:"absolute", top:"35%", zIndex:1,  textAlign:"center"}}>
                    <h2 style={{color:"#fff", marginBottom:"2rem"}}>{item.subCaption}</h2>
                    
                    <h1 style={{color:"#fff"}}>{item.caption}</h1>
                </div>
                <CarouselCaption
                  className="text-danger"
                  captionText=""
                  captionHeader={item.title}
                />
              </CarouselItem>
            );
          })}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={() => this.previous()}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={() => this.next()}
          />
        </Carousel>
      </div>
    );
  }
}

export default Slider;

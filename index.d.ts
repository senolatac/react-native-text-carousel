import { Component } from 'react';

export class TextCarousel extends Component<
  { 
    children: JSX.Element | JSX.Element[],
    height?: number,
    interval?: number,
    direction?: 'up' | 'down'
   }
> {}

export class CarouselItem extends Component<
  { children: JSX.Element | JSX.Element[] }
> {}

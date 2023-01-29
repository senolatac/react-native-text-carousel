
// TODO: the objective is refactor this code to use hooks
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Animated, Easing } from 'react-native';

export class TextCarousel extends React.PureComponent {

  constructor(props){
    super(props);
    
    this.state = {
      anim: new Animated.ValueXY({x:0,y:-props.height})
    }

  }

  render(){
    let {height} = this.props;
    let children = this.formatChildren();
    let scrollH = children.length * height;
    
    this.current = 1
    this.total = children.length
    
    return <View style={[styles.container,{height}]}>
      <Animated.View style={[styles.scrollView, 
        { height: scrollH, transform: this.state.anim.getTranslateTransform() }]}>
        { this.formatChildren() }
      </Animated.View>
    </View> 
  }

  componentDidMount(){
    let {interval, height, direction} = this.props;
    let isUp = direction === 'up';
    let directionValue = isUp ? 1 : -1;

    this.timer = setInterval(()=>{

      this.current += directionValue
      
      this.startAnimation();

    }, interval);
  }

  startAnimation() {
      Animated.timing(this.state.anim, {
          toValue: {x: 0, y: -this.current * this.props.height},
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
      }).start(() => this.loopAnimation());
  }

  loopAnimation() {
      let {height, direction} = this.props;
      let isUp = direction === 'up';

      let cloneIndex = isUp ? this.total - 1 : 0;
      let resetIndex = isUp ? 1 : this.total - 2;
      if (this.current === cloneIndex) {
          this.current = resetIndex;
          Animated.timing(this.state.anim, {
              toValue: {x: 0, y: -this.current * height},
              duration: 0,
              useNativeDriver: true,
          }).start(() => this.startAnimation());
      }
  }


  UNSAFE_componentWillMount(){
    this.timer && clearInterval(this.timer);
  }

  formatChildren(){
    let {children, height} = this.props;
    var result = [];

    React.Children.forEach(children, (child, index)=>{
      if (React.isValidElement(child) && child.type === CarouselItem){
        result.push(
          <View key={`tc-${index}`} style={{height}}>
            {child}
          </View>
        )
      }
    })

    if (result.length > 0){
      let firstItem = result[0]
      let lastItem = result[result.length - 1]
      result.unshift(React.cloneElement(lastItem, { key: `${lastItem.key}-last`}))
      result.push(React.cloneElement(firstItem, { key: `${firstItem.key}-first`}))
    }

    return result
  }

}

TextCarousel.defaultProps = {
  height: 40,
  interval: 4000,
  direction: 'up'
}

TextCarousel.propTypes = {
  height: PropTypes.number,
  interval: PropTypes.number,
  direction: PropTypes.oneOf(['up','down'])
}

export class CarouselItem extends React.PureComponent {
  render(){
    return (
      <View style={styles.itemStyle}>
        { React.Children.only(this.props.children) }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow:'hidden'
  },
  itemStyle: {
    flex:1
  },
  scrollView: {
  }
})

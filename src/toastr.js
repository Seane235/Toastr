'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Lib
import _ from 'lodash';

// Component
import Toast from './components/toast';
import Base from './components/base';
import Dial from './components/dial';
import Handle from './components/handle';
import ReactLogo from './components/react-logo';

class Toastr extends Component {
	constructor(props){
		super(props);
		this.state = {
			left: {
				status: 'bread',
				isDown: false,
				toastTime: 8000
			},
			right: {
				status: 'bread',
				isDown: false,
				toastTime: 8000
			},
			eaten: 0,
			notis: [
				'Toastr Online',
			 'Booting Up....',
			 'Let\' get toasty'
		 ]
		}
		this.toastToasted = this.toastToasted.bind(this);
		this.toastWasClicked = this.toastWasClicked.bind(this);
		this.handleWasClicked = this.handleWasClicked.bind(this);
		this._getToastTime = this._getToastTime.bind(this);
		this._setToast = this._setToast.bind(this);
	}

	toastToasted(side) {
		this._setToast(side, {
			status: 'toast',
			isDown: false
		})
	}

	toastEaten(side) {
		var toast = document.getElementById(`toast-${side}`);
		Velocity(toast, {
			opacity: 0
		}, {
			complete: function(){
				this._setToast(side, {
					status: 'bread'
				});
				this.setState(function(previousState, props){
					return {
						eaten: previousState.eaten + 1
					}
				});
			}.bind(this)
		});
	}

	 _getToastStatus(side) {
		return this.state[side].status;
	}

	_getToastTime(side) {
		return this.state[side].toastTime;
	}

	_setToast(side, targetState) {
		var sideState = this.state[side];
		_.extend(sideState, targetState);

		var newState = {};
		newState[side] = sideState;;

		this.setState(newState);
	}

	spinLogo(side) {
		var duration = this._getToastTime(side);
		var logo = ReactDOM.findDOMNode(this.logo);
		if(logo.classList[0] === 'velocity-animating'){
			return false;
		}
		Velocity(logo, {
			rotateZ: '+=1080deg'
		}, {
			easing: 'easeInOutCubic',
			duration: duration
		});
	}

	toastWasClicked(side) {
		var status = this._getToastStatus(side);
		switch (status) {
			case 'bread':
				this._setToast(side, {status: 'ready'});
				break;
			case 'toast':
				this.toastEaten(side);
				break;
			default:
		}
	}

	handleWasClicked(side) {
		var status = this._getToastStatus(side);
		if( status !== 'ready') return false;
		this._setToast(side, {
			status: 'toasting',
			isDown: true
		});
		this.spinLogo(side);
	}


	render() {
		var size = 400;
		return(
			<div id="toastr">
			<ul>
				<li>1: Click toast to load Toastr</li>
				<li>2: Click lever to begin Toasting Process</li>
				<li>3: Enjoy spinning logo until toast is toasted to satisfaction</li>
				<li>4: Click toast to consume & repeat Toastr process</li>
			</ul>
			<svg x="0px" y="0px"
				 width={size} height={size} viewBox="0 0 1261.459 1312.035" enable-background="new 0 0 1261.459 1312.035">
			<Toast ref={toast => this.toastLeft = toast} toastToasted={this.toastToasted} side='left' data={this.state.left} onToastClick={this.toastWasClicked}/>
			<Toast ref={toast => this.toastRight = toast} toastToasted={this.toastToasted} side='right' data={this.state.right} onToastClick={this.toastWasClicked}/>
			<Base />

			<g id="Tracks">
				<path fill="#333333" d="M112.426,964.591c-2.408,0-3.811-1.952-3.811-4.356V684.312c0-2.41,1.403-4.358,3.811-4.358
					c2.408,0,3.812,1.948,3.812,4.358v275.922C116.237,962.639,114.834,964.591,112.426,964.591z"/>
				<path fill="#333333" d="M187.694,964.591c-2.408,0-4.764-1.952-4.764-4.356V684.312c0-2.41,2.355-4.358,4.764-4.358
					s4.764,1.948,4.764,4.358v275.922C192.458,962.639,190.103,964.591,187.694,964.591z"/>
			</g>

			<Dial side='left' />
			<Dial side='right' />

			<Handle side='left' isDown={this.state.left.isDown} handleClick={this.handleWasClicked} />
			<Handle side='right' isDown={this.state.right.isDown} handleClick={this.handleWasClicked} />
			<ReactLogo ref={ logo => this.logo = logo }/>
			</svg>
			</div>
		)
	}
}

ReactDOM.render(<Toastr />, document.getElementById('app'));

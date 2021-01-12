import React, { useState } from "react";
import { 
	View,
	Image, 
	useEventHandler, 
	Button,
} from "@nodegui/react-nodegui";

import {
	QPushButtonSignals,
	AspectRatioMode,
	QIcon,
	QSize,
	QLabelSignals,
	WidgetEventTypes,
	QMouseEvent,
} from "@nodegui/nodegui";

import pauseIconPath from "../../assets/pause-bright-full.png";
const pauseIcon = new QIcon(pauseIconPath);

import playIconPath from "../../assets/play-bright-full.png";
const playIcon = new QIcon(playIconPath);

import prevIconPath from "../../assets/prev-bright-full.png";
const prevIcon = new QIcon(prevIconPath);

import nextIconPath from "../../assets/next-bright-full.png";
const nextIcon = new QIcon(nextIconPath);


interface PlaybackControlProps {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
}

export default function PlaybackControl(props: PlaybackControlProps) {
	const { 
		isPlaying,
		play,
		pause,
		next,
		prev,
	} = props;

	return (
		<View id="controls" styleSheet={styleSheet}>
	        <Button
              id="ACBtn"
              icon={prevIcon}
              iconSize={new QSize(40, 40)}
              on={{ clicked: prev }}
            />
	        {
	        	!isPlaying ? (
				    <Button
		              id="ACBtn"
		              icon={playIcon}
		              iconSize={new QSize(50, 50)}
		              on={{ clicked: play }}
		            />
		        ) : (
		        	<Button
		              id="ACBtn"
		              icon={pauseIcon}
		              iconSize={new QSize(50, 50)}
		              on={{ clicked: pause }}
		            />
		        )
		    }
		    <Button
              id="ACBtn"
              icon={nextIcon}
              iconSize={new QSize(40, 40)}
              on={{ clicked: next }}
            />
        </View>
	);
}

const styleSheet = `
	#controls {
		flex: 1;
	    flex-direction: 'row';
	    justify-content: 'center';
	    height: '80px';
	    width: '360px';
	    padding: '20px';
	    border: '3px solid green';
    }

    #ACBtn {
    	background-color: '#272727';
    	border: 3px solid #272727;
    	border-radius: '25%';
    }

    #ACBtn:pressed {
    	background-color: '#363636';
    }

    #ACBtn:hover {
    	background-color: '#363636';
    }
`;

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

import dialogIconPath from "../../assets/tv-dialog-bright-full.png";
const dialogIcon = new QIcon(dialogIconPath);

import nightIconPath from "../../assets/tv-night-bright-full.png";
const nightIcon = new QIcon(nightIconPath);

import dialogOffIconPath from "../../assets/tv-dialog-disabled-bright-full.png";
const dialogOffIcon = new QIcon(dialogOffIconPath);

import nightOffIconPath from "../../assets/tv-night-disabled-bright-full.png";
const nightOffIcon = new QIcon(nightOffIconPath);


interface TvPlaybackControlProps {
  isTvDialogOn: boolean;
  isTvNightOn: boolean;
  dialog: () => void;
  night: () => void;
}

export default function TvPlaybackControl(props: TvPlaybackControlProps) {
	const { 
		isTvDialogOn,
		isTvNightOn,
		dialog,
		night,
	} = props;

	return (
		<View id="controls" styleSheet={styleSheet}>
		    <Button
              id="ACBtn"
              icon={isTvNightOn ? nightIcon : nightOffIcon}
              iconSize={new QSize(40, 40)}
              on={{ clicked: night }}
            />
            <Button
              id="ACBtn"
              icon={isTvDialogOn ? dialogIcon : dialogOffIcon}
              iconSize={new QSize(40, 40)}
              on={{ clicked: dialog }}
            />
        </View>
	);
}

const styleSheet = `
	#controls {
		flex: 1;
	    flex-direction: 'row';
	    justify-content: 'space-evenly';
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

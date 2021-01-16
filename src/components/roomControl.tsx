import React, { useRef } from "react";
import { View, Text, Image, Button, useEventHandler } from "@nodegui/react-nodegui";

import {
  AspectRatioMode,
  QIcon,
  QSize,
  QLabelSignals,
  WidgetEventTypes
} from "@nodegui/nodegui";

import { unescape } from "../utils/unescape";

import audioOrangeIconPath from "../../assets/audio-playing-orange-full.png";
const audioOrangeIcon = new QIcon(audioOrangeIconPath);

import audioIconPath from "../../assets/audio-bright-full.png";
const audioIcon = new QIcon(audioIconPath);


interface RoomControlProps {
  uuid: string;
  select: (uuid: string) => void;
  isPlaying: boolean;
  deviceName: string;
  selectedDeviceUuid: string;
}

export default function RoomControl(props: RoomControlProps) {
	const { 
		isPlaying,
		select,
		uuid,
		deviceName,
		selectedDeviceUuid,
	} = props;

	const selectHandler = useEventHandler<QLabelSignals>({
		[WidgetEventTypes.MouseButtonPress]: () => { select(uuid); }
	}, []);

	return (
		<Button
			styleSheet={styleSheet}
			id={selectedDeviceUuid === uuid ? 'ActiveRoomBtn' : 'RoomBtn'}
			text={` ${unescape(deviceName)}`}
			icon={isPlaying ? audioOrangeIcon : audioIcon}
			iconSize={new QSize(30, 30)}
			on={{ clicked: () => { select(uuid); } }}
        />
	);
}

const styleSheet = `
	#RoomBtn, #ActiveRoomBtn {
		color: white;
		text-align: left;
		background-color: #272727;
		border: 3px solid #272727;
		padding-left: '7px';
		padding-top: '3px';
		padding-bottom: '3px';
	}

	#ActiveRoomBtn {
		border: 3px solid #363636;
	}
`;

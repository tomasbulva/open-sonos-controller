import React, { useRef } from "react";
import { Text, View } from "@nodegui/react-nodegui";
import { unescape } from "../utils/unescape";

interface CurrentTrackMetaDataViewProps {
  currentTrackMetaData: {
    Album?: string;
    Artist?: string;
    AlbumArtUri?: string;
    Title?: string;
    Duration?: string;
  };
}

export default function CurrentTrackMetaDataView(props: CurrentTrackMetaDataViewProps) {
	const { currentTrackMetaData } = props;
	return (
		<View id="trackData" styleSheet={styleSheet}> 
			<Text id="Title" wordWrap={true}>{unescape(currentTrackMetaData.Title || 'Unknown')}</Text>
			<Text id="Artist" wordWrap={true}>{unescape(currentTrackMetaData.Artist || '')}{currentTrackMetaData.Album ? ` - ${currentTrackMetaData.Album}` : ''}</Text>
		</View>
	);
}

const styleSheet = `
  #trackData {
    width: '360px';
    padding: '0px';
    margin: '0px';
  }

  #Title {
  	color: 'white';
  	font-size: 20px;
  	margin-top: '10px';
  	margin-bottom: '5px';
  	padding: '0px';
    width: '360px';
  }

  #Artist {
  	color: white;
  	font-size: 15px;
  	margin-top: '0px';
  	margin-bottom: '5px';
  	padding: '0px';
    width: '360px';
  }
`;
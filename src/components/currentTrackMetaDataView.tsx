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
      <View id="spacer-top" />
			<Text id="Title" wordWrap={true}>{`${ unescape( currentTrackMetaData?.Title || 'Unknown' ) }<br/><small><font color="#afafaf">${ unescape(currentTrackMetaData?.Artist || '') }${currentTrackMetaData?.Album ? ` - ${currentTrackMetaData?.Album}` : ''}</font></small>`}</Text>
      <View id="spacer" />
    </View>
	);
}

const styleSheet = `
  #spacer-top, #spacer {
    border: 0px solid red;
  }

  #trackData, #Title, #Artist {
    border: 0px solid green;
  }


  #trackData {
    flex: 1 1 1px;
    width: '360px';
    padding: '0px';
    margin: '0px';
  }

  #spacer-top {
    flex: 1 1 15px;
    height: 15px;
  }

  #spacer {
    flex: 1 1 20px;
    height: 20px;
  }

  #Title {
  	color: 'white';
  	font-size: 20px;
  	margin-top: '0px';
  	margin-bottom: '0px';
  	padding: '0px';
    width: '360px';
  }
`;
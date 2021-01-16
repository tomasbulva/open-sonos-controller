import React, { useRef } from "react";
import { Image, View } from "@nodegui/react-nodegui";

import tvIconPath from "../../assets/tv-gray-full.png";

import {
  AspectRatioMode
} from "@nodegui/nodegui";

export default function AlbumArtView() {
	return (
		<View id="albumArtView" styleSheet={styleSheet}>
			<Image
				id="tvIcon"
	            aspectRatioMode={AspectRatioMode.KeepAspectRatio}
	            src={tvIconPath}
	        />
        </View>
	);
}

const styleSheet = `
	#albumArtView {
		flex: 1;
	    flex-direction: column;
	    height: 'auto';
	    width: '360px';
	    height: '360px';
	    align-items: 'center';
	    align-content: 'center';
	    justify-content: 'center';
	    background-color: #363636;
    }

    #tvIcon {
    	width: '100px';
	    height: '100px';
    }
`;

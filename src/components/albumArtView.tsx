import React, { useRef } from "react";
import { Image, View } from "@nodegui/react-nodegui";

import albumPlaceholderIconPath from "../../assets/record-gray-full.png";

import {
  AspectRatioMode,
  QIcon
} from "@nodegui/nodegui";

interface AlbumArtViewProps {
  albumArtUri?: string;
}

export default function AlbumArtView(props: AlbumArtViewProps) {
	const { albumArtUri } = props;
	
	return albumArtUri ? (
		<View styleSheet={styleSheet} id="cover">
			<Image
				id="albumCoverImage"
	            aspectRatioMode={AspectRatioMode.KeepAspectRatio}
	            src={albumArtUri}
	        />
        </View>
	) : (
		<View styleSheet={styleSheet} id="nocover">
			<Image
				id="albumCoverPlaceholder"
	            aspectRatioMode={AspectRatioMode.KeepAspectRatio}
	            src={albumPlaceholderIconPath}
	        />
        </View>
	)
}

const styleSheet = `
	#nocover {
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

    #cover {
		flex: 1;
	    flex-direction: column;
	    width: '360px';
	    align-items: stretch;
	    align-content: stretch;
    }

    #albumCoverImage {
    	width: '360px';
    	height: '360px';
    }
    
    #albumCoverPlaceholder {
    	width: '100px';
	    height: '100px';
    }
`;

import React from 'react';
import {OffthreadVideo, staticFile} from 'remotion';
 

export const MyComposition1 = () => {
  return (
    <OffthreadVideo src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
  );
};

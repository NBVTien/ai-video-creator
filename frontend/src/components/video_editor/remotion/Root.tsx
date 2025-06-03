import React from 'react';
import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import { MyComposition1 } from './Composition_1';
 
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Bunny"
        component={MyComposition}
        durationInFrames={1200}
        fps={60}
        width={1920}
        height={1080}
      />

      <Composition
        id="Bunny1"
        component={MyComposition1}
        durationInFrames={1200}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
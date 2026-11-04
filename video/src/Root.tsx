import React from 'react';
import { Composition } from 'remotion';
import { Ch1, ch1Timing } from './videos/ch1/Ch1';
import { Ch2, ch2Timing } from './videos/ch2/Ch2';

const list = [
  { id: 'ch1-casos-de-uso', C: Ch1, t: ch1Timing },
  { id: 'ch2-descripcion-cu', C: Ch2, t: ch2Timing },
];

export function Root() {
  return (
    <>
      {list.map(({ id, C, t }) => (
        <Composition key={id} id={id} component={C} durationInFrames={t.total} fps={t.fps} width={1280} height={720} />
      ))}
    </>
  );
}

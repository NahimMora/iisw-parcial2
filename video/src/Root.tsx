import React from 'react';
import { Composition } from 'remotion';
import { Ch1, ch1Timing } from './videos/ch1/Ch1';

const list = [
  { id: 'ch1-casos-de-uso', C: Ch1, t: ch1Timing },
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

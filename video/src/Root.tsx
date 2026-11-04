import React from 'react';
import { Composition } from 'remotion';
import { Ch1, ch1Timing } from './videos/ch1/Ch1';
import { Ch2, ch2Timing } from './videos/ch2/Ch2';
import { Ch3, ch3Timing } from './videos/ch3/Ch3';
import { Ch4, ch4Timing } from './videos/ch4/Ch4';
import { Ch5, ch5Timing } from './videos/ch5/Ch5';
import { Ch6, ch6Timing } from './videos/ch6/Ch6';
import { Ch7, ch7Timing } from './videos/ch7/Ch7';

const list = [
  { id: 'ch1-casos-de-uso', C: Ch1, t: ch1Timing },
  { id: 'ch2-descripcion-cu', C: Ch2, t: ch2Timing },
  { id: 'ch3-secuencia', C: Ch3, t: ch3Timing },
  { id: 'ch4-prototipos-hu', C: Ch4, t: ch4Timing },
  { id: 'ch5-pruebas', C: Ch5, t: ch5Timing },
  { id: 'ch6-tipos-sistemas', C: Ch6, t: ch6Timing },
  { id: 'ch7-reingenieria-formales', C: Ch7, t: ch7Timing },
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

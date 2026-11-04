import React from 'react';
import { GenericVideo, type GenericBeat } from '../../engine/Generic';
import type { Timing } from '../../engine/engine';
import timing from './timing.json';
import script from './script.json';

export const ch5Timing = timing as Timing;
export function Ch5() {
  return <GenericVideo timing={ch5Timing} beats={script.beats as GenericBeat[]} vid="ch5" title="Cap. 5 · Pruebas de requerimientos" />;
}

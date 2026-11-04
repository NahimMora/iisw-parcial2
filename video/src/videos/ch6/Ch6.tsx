import React from 'react';
import { GenericVideo, type GenericBeat } from '../../engine/Generic';
import type { Timing } from '../../engine/engine';
import timing from './timing.json';
import script from './script.json';

export const ch6Timing = timing as Timing;
export function Ch6() {
  return <GenericVideo timing={ch6Timing} beats={script.beats as GenericBeat[]} vid="ch6" title="Cap. 6 · Tipos de sistemas" />;
}

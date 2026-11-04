import React from 'react';
import { GenericVideo, type GenericBeat } from '../../engine/Generic';
import type { Timing } from '../../engine/engine';
import timing from './timing.json';
import script from './script.json';

export const ch7Timing = timing as Timing;
export function Ch7() {
  return <GenericVideo timing={ch7Timing} beats={script.beats as GenericBeat[]} vid="ch7" title="Cap. 7 · Mantenimiento, reingeniería y métodos formales" />;
}

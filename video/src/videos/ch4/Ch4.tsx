import React from 'react';
import { GenericVideo, type GenericBeat } from '../../engine/Generic';
import type { Timing } from '../../engine/engine';
import timing from './timing.json';
import script from './script.json';

export const ch4Timing = timing as Timing;
export function Ch4() {
  return <GenericVideo timing={ch4Timing} beats={script.beats as GenericBeat[]} vid="ch4" title="Cap. 4 · Prototipos e historias de usuario" />;
}

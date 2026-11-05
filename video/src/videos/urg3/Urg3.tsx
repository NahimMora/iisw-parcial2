import React from 'react';
import { GenericVideo, type GenericBeat } from '../../engine/Generic';
import type { Timing } from '../../engine/engine';
import timing from './timing.json';
import script from './script.json';

export const urg3Timing = timing as Timing;
export function Urg3() {
  return <GenericVideo timing={urg3Timing} beats={script.beats as GenericBeat[]} vid="urg3" title="Modo urgente · video 3" />;
}

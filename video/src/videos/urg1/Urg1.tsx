import React from 'react';
import { GenericVideo, type GenericBeat } from '../../engine/Generic';
import type { Timing } from '../../engine/engine';
import timing from './timing.json';
import script from './script.json';

export const urg1Timing = timing as Timing;
export function Urg1() {
  return <GenericVideo timing={urg1Timing} beats={script.beats as GenericBeat[]} vid="urg1" title="Modo urgente · video 1" />;
}

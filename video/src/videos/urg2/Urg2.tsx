import React from 'react';
import { GenericVideo, type GenericBeat } from '../../engine/Generic';
import type { Timing } from '../../engine/engine';
import timing from './timing.json';
import script from './script.json';

export const urg2Timing = timing as Timing;
export function Urg2() {
  return <GenericVideo timing={urg2Timing} beats={script.beats as GenericBeat[]} vid="urg2" title="Modo urgente · video 2" />;
}

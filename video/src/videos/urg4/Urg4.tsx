import React from 'react';
import { GenericVideo, type GenericBeat } from '../../engine/Generic';
import type { Timing } from '../../engine/engine';
import timing from './timing.json';
import script from './script.json';

export const urg4Timing = timing as Timing;
export function Urg4() {
  return <GenericVideo timing={urg4Timing} beats={script.beats as GenericBeat[]} vid="urg4" title="Modo urgente · video 4" />;
}

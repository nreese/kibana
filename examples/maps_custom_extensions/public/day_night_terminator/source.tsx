/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ReactElement } from 'react';
import { GeoJsonProperties } from 'geojson';
import { Adapters } from '../../../../src/plugins/inspector/common/adapters';
import type {
  BoundsFilters,
  DataRequest,
  GeoJsonWithMeta,
  IField,
  ImmutableSourceProperty,
  ITooltipProperty,
  IVectorSource,
  LICENSED_FEATURES,
  SourceEditorArgs,
  SourceTooltipConfig,
} from '../../../../x-pack/plugins/maps/public';
import {
  AbstractSourceDescriptor,
  Attribution,
  EMPTY_FEATURE_COLLECTION,
  FieldFormatter,
  MapExtent,
  MAX_ZOOM,
  MIN_ZOOM,
  PreIndexedShape,
  VECTOR_SHAPE_TYPE,
  VectorSourceRequestMeta,
  VectorSourceSyncMeta,
} from '../../../../x-pack/plugins/maps/common';

export const DAY_NIGHT_TERMINATOR_SOURCE_TYPE = 'DAY_NIGHT';

interface SourceDescriptor {
  type: string;
  numSamples: number;
}

export class DayNightTerminatorSource implements IVectorSource {
  private readonly _descriptor: SourceDescriptor;
  private readonly _inspectorAdapters?: Adapters;

  static createDescriptor(descriptor: Partial<SourceDescriptor>): SourceDescriptor {
    return {
      type: DAY_NIGHT_TERMINATOR_SOURCE_TYPE,
      numSamples: descriptor.numSamples !== undefined ? descriptor.numSamples : 3,
    };
  }

  constructor(descriptor: Partial<SourceDescriptor>, inspectorAdapters?: Adapters) {
    this._descriptor = DayNightTerminatorSource.createDescriptor(descriptor);
    this._inspectorAdapters = inspectorAdapters;
  }

  destroy() {}

  async getDisplayName() {
    return 'Day night terminator';
  }

  getInspectorAdapters(): Adapters | undefined {
    return this._inspectorAdapters;
  }

  isFieldAware(): boolean {
    return false;
  }

  isFilterByMapBounds(): boolean {
    return false;
  }

  isGeoGridPrecisionAware(): boolean {
    return false;
  }

  isQueryAware(): boolean {
    return false;
  }

  isRefreshTimerAware(): boolean {
    return true;
  }

  async isTimeAware(): Promise<boolean> {
    return true;
  }

  async getImmutableProperties(): Promise<ImmutableSourceProperty[]> {
    return [];
  }

  getAttributionProvider(): (() => Promise<Attribution[]>) | null {
    return null;
  }

  isESSource(): boolean {
    return false;
  }

  renderSourceSettingsEditor(sourceEditorArgs: SourceEditorArgs): ReactElement<any> | null {
    return null;
  }

  async supportsFitToBounds(): Promise<boolean> {
    return false;
  }

  showJoinEditor(): boolean {
    return false;
  }

  getJoinsDisabledReason(): string | null {
    return null;
  }

  cloneDescriptor(): AbstractSourceDescriptor {
    return {
      ...this._descriptor,
    };
  }

  getFieldNames(): string[] {
    return [];
  }

  getApplyGlobalQuery(): boolean {
    return false;
  }

  getApplyGlobalTime(): boolean {
    return true;
  }

  getIndexPatternIds(): string[] {
    return [];
  }

  getQueryableIndexPatternIds(): string[] {
    return [];
  }

  getGeoGridPrecision(zoom: number): number {
    return 0;
  }

  async getPreIndexedShape(properties: GeoJsonProperties): Promise<PreIndexedShape | null> {
    return null;
  }

  async createFieldFormatter(field: IField): Promise<FieldFormatter | null> {
    return null;
  }

  async getValueSuggestions(field: IField, query: string): Promise<string[]> {
    return [];
  }

  getMinZoom(): number {
    return MIN_ZOOM;
  }

  getMaxZoom(): number {
    return MAX_ZOOM;
  }

  async getLicensedFeatures(): Promise<LICENSED_FEATURES[]> {
    return [];
  }

  async getTooltipProperties(properties: GeoJsonProperties): Promise<ITooltipProperty[]> {
    return [];
  }

  async getBoundsForFilters(
    boundsFilters: BoundsFilters,
    registerCancelCallback: (callback: () => void) => void
  ): Promise<MapExtent | null> {
    return null;
  }

  async getGeoJsonWithMeta(
    layerName: string,
    searchFilters: VectorSourceRequestMeta,
    registerCancelCallback: (callback: () => void) => void,
    isRequestStillActive: () => boolean
  ): Promise<GeoJsonWithMeta> {
    const featureCollection = EMPTY_FEATURE_COLLECTION;
    return {
      data: featureCollection,
    };
  }

  async getFields(): Promise<IField[]> {
    return [];
  }

  getFieldByName(fieldName: string): IField | null {
    return null;
  }

  async getLeftJoinFields(): Promise<IField[]> {
    return [];
  }

  getSyncMeta(): VectorSourceSyncMeta | null {
    return null;
  }

  createField({ fieldName }: { fieldName: string }): IField {
    throw new Error('createField not implemented');
  }

  hasTooltipProperties(): boolean {
    return false;
  }

  async getSupportedShapeTypes(): Promise<VECTOR_SHAPE_TYPE[]> {
    return [VECTOR_SHAPE_TYPE.POLYGON];
  }

  isBoundsAware(): boolean {
    return false;
  }

  getSourceTooltipContent(sourceDataRequest?: DataRequest): SourceTooltipConfig {
    return {
      tooltipContent: null,
      areResultsTrimmed: false,
    };
  }
}

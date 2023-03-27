/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  DataRequestDescriptor,
  CustomIcon,
  DrawState,
  EMSVectorTileLayerDescriptor,
  EditState,
  Goto,
  HeatmapLayerDescriptor,
  LayerDescriptor,
  LayerGroupDescriptor,
  MapCenter,
  MapExtent,
  MapSettings,
  TooltipState,
  VectorLayerDescriptor,
} from '../../../common/descriptor_types';
import { LAYER_TYPE } from '../../../common/constants';
import { ILayer } from './layer';
import { isLayerGroup, LayerGroup } from './layer_group';
import {
  BlendedVectorLayer,
  MvtVectorLayer,
  GeoJsonVectorLayer,
} from './vector_layer';
import { EmsVectorTileLayer } from './ems_vector_tile_layer/ems_vector_tile_layer';
import { HeatmapLayer } from './heatmap_layer';
import { RasterTileLayer } from './raster_tile_layer/raster_tile_layer';
import { IVectorSource } from './sources/vector_source';
import { ISource } from '../sources/source';
import { createSourceInstance } from '../sources/source_registry';
import { ESGeoGridSource } from './sources/es_geo_grid_source';
import { EMSTMSSource } from './sources/ems_tms_source';
import { IRasterSource } from './sources/raster_source';

function createJoinInstances(vectorLayerDescriptor: VectorLayerDescriptor, source: IVectorSource) {
  return vectorLayerDescriptor.joins
    ? vectorLayerDescriptor.joins.map((joinDescriptor) => {
        return new InnerJoin(joinDescriptor, source);
      })
    : [];
}

export function createLayerInstance(
  layerDescriptor: LayerDescriptor,
  customIcons: CustomIcon[],
  chartsPaletteServiceGetColor?: (value: string) => string | null
): ILayer {
  if (layerDescriptor.type === LAYER_TYPE.LAYER_GROUP) {
    return new LayerGroup({ layerDescriptor: layerDescriptor as LayerGroupDescriptor });
  }

  const source: ISource = createSourceInstance(layerDescriptor.sourceDescriptor);
  switch (layerDescriptor.type) {
    case LAYER_TYPE.RASTER_TILE:
      return new RasterTileLayer({ layerDescriptor, source: source as IRasterSource });
    case LAYER_TYPE.EMS_VECTOR_TILE:
      return new EmsVectorTileLayer({
        layerDescriptor: layerDescriptor as EMSVectorTileLayerDescriptor,
        source: source as EMSTMSSource,
      });
    case LAYER_TYPE.HEATMAP:
      return new HeatmapLayer({
        layerDescriptor: layerDescriptor as HeatmapLayerDescriptor,
        source: source as ESGeoGridSource,
      });
    case LAYER_TYPE.GEOJSON_VECTOR:
      return new GeoJsonVectorLayer({
        layerDescriptor: layerDescriptor as VectorLayerDescriptor,
        source: source as IVectorSource,
        joins: createJoinInstances(
          layerDescriptor as VectorLayerDescriptor,
          source as IVectorSource
        ),
        customIcons,
        chartsPaletteServiceGetColor,
      });
    case LAYER_TYPE.BLENDED_VECTOR:
      return new BlendedVectorLayer({
        layerDescriptor: layerDescriptor as VectorLayerDescriptor,
        source: source as IVectorSource,
        customIcons,
        chartsPaletteServiceGetColor,
      });
    case LAYER_TYPE.MVT_VECTOR:
      return new MvtVectorLayer({
        layerDescriptor: layerDescriptor as VectorLayerDescriptor,
        source: source as IVectorSource,
        joins: createJoinInstances(
          layerDescriptor as VectorLayerDescriptor,
          source as IVectorSource
        ),
        customIcons,
      });
    default:
      throw new Error(`Unrecognized layerType ${layerDescriptor.type}`);
  }
}
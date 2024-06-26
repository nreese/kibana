/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiDataGridCellValueElementProps } from '@elastic/eui';
import { RowRenderer } from '../../..';
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
import { Filter } from '../../../../../../../src/plugins/data/public';
import { Ecs } from '../../../ecs';
import { BrowserFields, TimelineNonEcsData } from '../../../search_strategy';
import { ColumnHeaderOptions } from '../columns';

/** The following props are provided to the function called by `renderCellValue` */
export type CellValueElementProps = EuiDataGridCellValueElementProps & {
  asPlainText?: boolean;
  browserFields?: BrowserFields;
  data: TimelineNonEcsData[];
  ecsData?: Ecs;
  eventId: string; // _id
  globalFilters?: Filter[];
  header: ColumnHeaderOptions;
  isDraggable: boolean;
  linkValues: string[] | undefined;
  rowRenderers?: RowRenderer[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFlyoutAlert?: (data: any) => void;
  timelineId: string;
  truncate?: boolean;
};

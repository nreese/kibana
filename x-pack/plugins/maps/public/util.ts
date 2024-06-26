/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { EMSClient, FileLayer, TMSService } from '@elastic/ems-client';
import { EMS_APP_NAME, FONTS_API_PATH } from '../common/constants';
import { getHttp, getTilemap, getKibanaVersion, getEMSSettings } from './kibana_services';
import { getLicenseId } from './licensed_features';

export function getKibanaTileMap(): unknown {
  return getTilemap();
}

export async function getEmsFileLayers(): Promise<FileLayer[]> {
  if (!getEMSSettings().isEMSEnabled()) {
    return [];
  }

  return getEMSClient().getFileLayers();
}

export async function getEmsTmsServices(): Promise<TMSService[]> {
  if (!getEMSSettings().isEMSEnabled()) {
    return [];
  }

  return getEMSClient().getTMSServices();
}

let emsClient: EMSClient | null = null;
let latestLicenseId: string | undefined;
export function getEMSClient(): EMSClient {
  if (!emsClient) {
    const emsSettings = getEMSSettings();
    const proxyPath = '';
    const tileApiUrl = emsSettings!.getEMSTileApiUrl();
    const fileApiUrl = emsSettings!.getEMSFileApiUrl();

    emsClient = new EMSClient({
      language: i18n.getLocale(),
      appVersion: getKibanaVersion(),
      appName: EMS_APP_NAME,
      tileApiUrl,
      fileApiUrl,
      landingPageUrl: emsSettings!.getEMSLandingPageUrl(),
      fetchFunction(url: string) {
        return fetch(url);
      },
      proxyPath,
    });
  }
  const licenseId = getLicenseId();
  if (latestLicenseId !== licenseId) {
    latestLicenseId = licenseId;
    emsClient.addQueryParams({ license: licenseId ? licenseId : '' });
  }
  return emsClient;
}

export function getGlyphUrl(): string {
  const emsSettings = getEMSSettings();
  if (!emsSettings!.isEMSEnabled()) {
    return getHttp().basePath.prepend(`/${FONTS_API_PATH}/{fontstack}/{range}`);
  }

  return emsSettings!.getEMSFontLibraryUrl();
}

export function isRetina(): boolean {
  return window.devicePixelRatio === 2;
}

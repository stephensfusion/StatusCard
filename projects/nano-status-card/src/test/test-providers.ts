import { EnvironmentProviders, Provider, provideZonelessChangeDetection } from '@angular/core';

/** Global Angular providers for every test file (zoneless, no zone.js). */
const testProviders: (Provider | EnvironmentProviders)[] = [provideZonelessChangeDetection()];

export default testProviders;

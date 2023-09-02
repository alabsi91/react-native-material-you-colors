import { TurboModuleRegistry } from 'react-native';

import type { TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  getColors(): {
    system_neutral1: string[];
    system_neutral2: string[];
    system_accent1: string[];
    system_accent2: string[];
    system_accent3: string[];
  };
}

export default TurboModuleRegistry.getEnforcing<Spec>('MaterialYouColors');

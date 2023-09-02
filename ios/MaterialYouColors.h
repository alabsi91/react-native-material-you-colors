
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNMaterialYouColorsSpec.h"

@interface MaterialYouColors : NSObject <NativeMaterialYouColorsSpec>
#else
#import <React/RCTBridgeModule.h>

@interface MaterialYouColors : NSObject <RCTBridgeModule>
#endif

@end

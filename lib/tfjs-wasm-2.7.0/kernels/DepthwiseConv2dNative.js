/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { backend_util, DepthwiseConv2dNative } from '@tensorflow/tfjs-core';
let wasmDepthwiseConv2d;
function setup(backend) {
    wasmDepthwiseConv2d =
        backend.wasm.cwrap(DepthwiseConv2dNative, null /* void */, [
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
        ]);
}
function depthwiseConv2d(args) {
    const { inputs, attrs, backend } = args;
    const { x, filter } = inputs;
    const xId = backend.dataIdMap.get(x.dataId).id;
    const filterId = backend.dataIdMap.get(filter.dataId).id;
    const { strides, dilations, pad, dimRoundingMode } = attrs;
    const $dilations = dilations == null ? [1, 1] : dilations;
    const convInfo = backend_util.computeConv2DInfo(x.shape, filter.shape, strides, $dilations, pad, dimRoundingMode, true /* depthwise */);
    const filterHeight = convInfo.filterHeight;
    const filterWidth = convInfo.filterWidth;
    const padTop = convInfo.padInfo.top;
    const padRight = convInfo.padInfo.right;
    const padBottom = convInfo.padInfo.bottom;
    const padLeft = convInfo.padInfo.left;
    const dilationHeight = convInfo.dilationHeight;
    const dilationWidth = convInfo.dilationWidth;
    const strideHeight = convInfo.strideHeight;
    const strideWidth = convInfo.strideWidth;
    const inputChannels = convInfo.inChannels;
    const outputChannels = convInfo.outChannels;
    const isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
    if (convInfo.dataFormat !== 'channelsLast') {
        throw new Error(`wasm backend DepthwiseConv2dNative does not support dataFormat:'` +
            `${convInfo.dataFormat}'. Please use 'channelsLast'.`);
    }
    const out = backend.makeOutput(convInfo.outShape, 'float32');
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmDepthwiseConv2d(xId, x.shape[0], x.shape[1], x.shape[2], filterId, filterHeight, filterWidth, padTop, padRight, padBottom, padLeft, isSamePad, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, outId);
    return out;
}
export const depthwiseConv2dNativeConfig = {
    kernelName: DepthwiseConv2dNative,
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: depthwiseConv2d
};
//# sourceMappingURL=DepthwiseConv2dNative.js.map
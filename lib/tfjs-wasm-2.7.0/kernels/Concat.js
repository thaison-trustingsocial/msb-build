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
import { backend_util, Concat, util } from '@tensorflow/tfjs-core';
function concat(args) {
    const { inputs, backend } = args;
    const axis = util.parseAxisParam(args.attrs.axis, inputs[0].shape)[0];
    const outShape = backend_util.computeOutShape(inputs.map(t => t.shape), axis);
    const out = backend.makeOutput(outShape, inputs[0].dtype);
    if (util.sizeFromShape(outShape) === 0) {
        return out;
    }
    // Keep only non-empty tensors (ignore tensors with 0 in their shape).
    const $inputs = inputs.filter(t => util.sizeFromShape(t.shape) > 0);
    if ($inputs.length === 1) {
        return $inputs[0];
    }
    const shapes = $inputs.map(t => t.shape);
    backend_util.assertParamsConsistent(shapes, axis);
    const batchDim = util.sizeFromShape($inputs[0].shape.slice(0, axis));
    let sumInnerDims = 0;
    const innerDims = $inputs.map(input => {
        const innerDim = util.sizeFromShape(input.shape.slice(axis));
        sumInnerDims += innerDim;
        return innerDim;
    });
    const inVals = $inputs.map(input => backend.typedArrayFromHeap(input));
    const outVals = backend.typedArrayFromHeap(out);
    for (let b = 0; b < batchDim; b++) {
        let outOffset = b * sumInnerDims;
        for (let i = 0; i < inVals.length; i++) {
            const innerDim = innerDims[i];
            const inOffset = b * innerDim;
            const vals = inVals[i].subarray(inOffset, inOffset + innerDim);
            outVals.set(vals, outOffset);
            outOffset += innerDim;
        }
    }
    return out;
}
export const concatConfig = {
    kernelName: Concat,
    backendName: 'wasm',
    kernelFunc: concat,
};
//# sourceMappingURL=Concat.js.map
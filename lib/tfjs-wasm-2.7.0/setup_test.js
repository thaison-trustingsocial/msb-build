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
// tslint:disable-next-line:no-imports-from-dist
import { setTestEnvs, setupTestFilters } from '@tensorflow/tfjs-core/dist/jasmine_util';
setTestEnvs([{ name: 'test-wasm', backendName: 'wasm', isDataSync: true }]);
/**
 * Tests that have these substrings in their name will be included unless one
 * of the strings in excludes appears in the name.
 */
const TEST_FILTERS = [
    {
        startsWith: 'tensor ',
        excludes: [
            'complex',
            'derivative',
            // Downcasting broken, see: https://github.com/tensorflow/tfjs/issues/2590
            'Tensor2D float32 -> bool', 'Tensor2D int32 -> bool'
        ]
    },
    { include: 'softmax' },
    {
        include: 'pow',
        excludes: [
            'gradient',
            'broadcasting same rank Tensors different shape',
        ]
    },
    {
        include: 'add ',
        excludes: [
            'gradient',
            'upcasts when dtypes dont match',
            'complex',
        ]
    },
    { include: 'depthToSpace' },
    {
        include: 'avgPool',
        excludes: [
            'gradient',
            'avgPool3d',
        ]
    },
    {
        include: 'relu',
        excludes: [
            'derivative',
            'gradient',
            'valueAndGradients',
            'broadcasted bias',
            'fused A x B with 2d bias' // Fused matMul with 2D bias not yet
            // supported.
        ]
    },
    {
        include: 'maxPool',
        excludes: [
            'maxPoolBackprop',
            'maxPool3d',
            'maxPool3dBackprop',
            'ignores NaNs',
            'maxPoolWithArgmax' // Not yet implemented.
        ]
    },
    { include: 'cropAndResize' },
    {
        include: 'resizeBilinear',
        excludes: [
            'gradients' // Not yet implemented.
        ]
    },
    {
        include: 'matmul ',
        excludes: [
            'valueAndGradients',
            'gradient',
            'zero in its shape',
            'matmul followed by mul',
            'upcasts',
            'fused A x B with elu',
            // supported.
            'fused A x B with 2d bias',
        ]
    },
    {
        include: 'depthwiseConv2D ',
        excludes: [
            'broadcasted bias',
            'gradient',
            'NCHW',
        ]
    },
    {
        include: 'conv2d ',
        excludes: [
            'broadcasted bias',
            'basic with elu',
            // supported.
            'gradient',
            'backProp input x=[2,3,3,1] f=[2,2,1,1] s=1 p=0',
            // defined.
            'NCHW',
            // Issue: https://github.com/tensorflow/tfjs/issues/3104.
            // Actual != expected.
            'relu bias stride 2 x=[1,8,8,16] f=[3,3,16,1] s=[2,2] d=8 p=same',
            'prelu bias stride 2 x=[1,8,8,16] f=[3,3,16,1] s=[2,2] d=8 p=same',
        ]
    },
    {
        include: 'prelu ',
        excludes: [
            'gradient',
            'derivative' // Missing gradient.
        ]
    },
    {
        include: ' cast ',
        excludes: [
            'complex',
            'shallow slice an input that was cast' // Slice is not implemented.
        ]
    },
    {
        include: 'gather',
        excludes: [
            'gradient' // Not yet implemented.
        ]
    },
    {
        include: 'sigmoid ',
        excludes: [
            'sigmoidCrossEntropy',
            'gradient' // Not yet implemented.
        ]
    },
    { include: 'scatterND ' },
    {
        include: 'abs ',
        excludes: [
            'gradient',
            'complex' // Complex numbers not supported yet.
        ]
    },
    {
        include: 'sub ',
        excludes: [
            'complex',
            'gradient',
            'upcasts',
        ]
    },
    {
        include: 'mul ',
        excludes: [
            'complex',
            'gradient',
        ]
    },
    {
        include: 'div ',
        excludes: [
            'gradient',
            'upcasts',
            'divNoNan' // divNoNan not yet implemented.
        ]
    },
    {
        include: 'batchNorm',
        excludes: [
            'gradient' // Gradient is missing.
        ]
    },
    { include: 'slice ' },
    { include: 'stridedSlice ' },
    { include: 'rotate ' },
    { include: 'flipLeftRight ' },
    { include: 'square ' },
    { include: 'squaredDifference' },
    {
        startsWith: 'min ',
        excludes: [
            '2D, axis=0',
            // implemented.
            'index corresponds to start of a non-initial window',
            // implemented.,
            'gradient',
            'ignores NaNs' // Doesn't yet ignore NaN
        ]
    },
    {
        startsWith: 'max ',
        excludes: [
            'gradient',
            'ignores NaNs' // Doesn't yet ignore NaN
        ]
    },
    {
        include: 'concat',
        excludes: [
            'complex',
            'gradient' // Split is not yet implemented
        ]
    },
    { include: 'transpose' },
    { include: 'oneHot' },
    { include: 'split' },
    { include: 'pad ', excludes: ['complex', 'zerosLike'] },
    {
        include: 'clip',
        excludes: [
            'gradient',
            'propagates NaNs' // clip delegates to XNNPACK which does not make
            // guarantees about behavior of nans.
        ]
    },
    { include: 'addN' },
    { include: 'nonMaxSuppression' },
    { include: 'argmax', excludes: ['gradient'] },
    { include: 'exp ' },
    { include: 'unstack' },
    {
        include: 'minimum',
        excludes: [
            'gradient',
            'broadcasts 2x1 Tensor2D and 2x2 Tensor2D' // Broadcasting along inner
            // dims not supported yet.
        ]
    },
    {
        include: 'maximum',
        excludes: [
            'gradient',
            'broadcasts 2x1 Tensor2D and 2x2 Tensor2D' // Broadcasting along inner
            // dims not supported yet.
        ]
    },
    {
        include: 'log ',
    },
    {
        startsWith: 'equal ',
        excludes: [
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'greater ',
        excludes: [
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'greaterEqual',
        excludes: [
            'gradient',
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'less ',
        excludes: [
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor3D float32',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'lessEqual',
        excludes: [
            'gradient',
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor3D float32',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'notEqual',
        excludes: [
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'mean ',
        excludes: [
            'axis=0',
        ]
    },
    { startsWith: 'reverse' },
    { startsWith: 'sum ' },
    { startsWith: 'cumsum' },
    {
        startsWith: 'logicalAnd ',
        excludes: [
            'broadcasting Tensor2D shapes',
            // not yet supported.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor4D shapes',
        ]
    },
    {
        startsWith: 'tile ',
        excludes: [
            'gradient',
            'string tensor' // String tensors not yet implemented.
        ]
    },
    { startsWith: 'sin ' },
    {
        startsWith: 'cos ',
        excludes: [
            'gradient',
        ]
    },
    {
        startsWith: 'tanh ',
        excludes: ['gradient'] // Gradient not yet implemented.
    },
    {
        startsWith: 'rsqrt ',
        excludes: ['gradient'] // Gradient not yet implemented.
    },
    {
        startsWith: 'sqrt ',
        excludes: ['gradient'] // Gradient not yet implemented.
    },
    {
        startsWith: 'where ',
        excludes: [
            '1D condition with higher rank a and b',
            'gradient' // Gradient not yet implemented.
        ]
    },
    {
        startsWith: 'zerosLike',
        // Complex numbers not supported yet.
        excludes: ['complex'],
    },
    {
        startsWith: 'onesLike',
        // Complex numbers not supported yet.
        excludes: ['complex'],
    }
];
const customInclude = (testName) => {
    // Include all regular describe() tests.
    if (testName.indexOf('test-wasm') < 0) {
        return true;
    }
    // Include all of the wasm specific tests.
    if (testName.startsWith('wasm')) {
        return true;
    }
    return false;
};
setupTestFilters(TEST_FILTERS, customInclude);
// Import and run all the tests from core.
// tslint:disable-next-line:no-imports-from-dist
import '@tensorflow/tfjs-core/dist/tests';
//# sourceMappingURL=setup_test.js.map
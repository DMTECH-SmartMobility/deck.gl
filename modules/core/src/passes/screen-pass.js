//
// A base render pass.
//
// Attribution: This class and the multipass system were inspired by
// the THREE.js EffectComposer and *Pass classes

import {ClipSpace, withParameters, clear} from '@luma.gl/core';
import Pass from './pass';

export default class ScreenPass extends Pass {
  constructor(gl, props = {}) {
    super(gl, props);
    const {module, fs, id} = props;
    this.model = new ClipSpace(gl, {id, fs, modules: [module]});
  }

  render(params) {
    const gl = this.gl;

    withParameters(gl, {framebuffer: params.outputBuffer, clearColor: [0, 0, 0, 0]}, () =>
      this._renderPass(gl, params)
    );
  }

  delete() {
    this.model.delete();
    this.model = null;
  }

  // Private methods

  /**
   * Renders the pass.
   * This is an abstract method that should be overridden.
   * @param {Framebuffer} inputBuffer - Frame buffer that contains the result of the previous pass
   * @param {Framebuffer} outputBuffer - Frame buffer that serves as the output render target
   */
  _renderPass(gl, {inputBuffer, outputBuffer}) {
    clear(gl, {color: true});
    this.model.draw({
      moduleSettings: this.props.moduleSettings,
      uniforms: {
        texture: inputBuffer,
        texSize: [inputBuffer.width, inputBuffer.height]
      },
      parameters: {
        depthWrite: false,
        depthTest: false
      }
    });
  }
}

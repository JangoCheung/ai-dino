import G6 from '@antv/g6';
import { JNN, TNetwork } from './fm';

let graph = null;

export function create() {
  graph = new G6.Graph({
    container: 'legend', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    width: 1200, // Number，必须，图的宽度
    height: 800, // Number，必须，图的高度
  });
}

export function update(nn: JNN, inputs: Array<number>) {
  const nodes = [];
  const edges = [];
  const max = nn.network.reduce((prev, curr) => Math.max(curr.length, prev), 0);
  // const inputs = new Array(nn.options.inputCount).fill('');

  // input
  inputs.forEach((input, index) => {
    nodes.push({
      id: `layer--1-neuron-${index}`,
      size: 100,
      x: 300 - 200,
      y: 150 * (index + 1) - 50 + (max - inputs.length) * 50,
      label: `input: ${input?.toFixed?.(3) || '-'}`
    })
  });

  nn.network.forEach((layer, layerIndex) => {
    const offetTop = (max - layer.length) * 50;

    // nodes
    layer.forEach((neuron, neuronIndex) => {
      nodes.push({
        id: `layer-${layerIndex}-neuron-${neuronIndex}`,
        size: 100,
        x: 300 * (layerIndex + 2) - 200,
        y: 150 * (neuronIndex + 1) - 50 + offetTop,
        label: `bias: ${neuron.bias.toFixed(3)}\ndelta: ${neuron.delta?.toFixed(3) || ''}\noutput: ${neuron.output?.toFixed(3) || ''}`
      })
    });

    // edges
    const prevLayer = layerIndex > 0 ? nn.network[layerIndex -1] : inputs;

    layer.forEach((neuron, neuronIndex) => {
      prevLayer.forEach((preLayerNeuron, preLayerNeuronIndex) => {
        edges.push({
          source: `layer-${layerIndex - 1}-neuron-${preLayerNeuronIndex}`,
          target: `layer-${layerIndex}-neuron-${neuronIndex}`,
          label: `weight: ${neuron.weights[preLayerNeuronIndex].toFixed(3)}`,
          labelCfg: {
            refX: -10,
            position: 'end',
          }
        })
      });
    });
  });

  // output value
  new Array(nn.options.outputCount).fill("").forEach((outputNode, outputIndex) => {
    nodes.push({
      id: `output-${outputIndex}`,
      size: 100,
      x: 300 * (nn.network.length + 2) - 200,
      y: 150 * (outputIndex + 1) - 50 + (max - nn.options.outputCount) * 50,
      label: `${outputIndex}`,
      style: {
        fill: '#ffff99',
      }
    });

    edges.push({
      source: `layer-${nn.network.length - 1}-neuron-${outputIndex}`,
      target: `output-${outputIndex}`,
    })
  });

  graph.data({ nodes, edges }); // 读取 Step 2 中的数据源到图上
  graph.render(); // 渲染图
}

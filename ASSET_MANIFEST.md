# Asset Manifest

This manifest records the first asset audit for the current static HTML repository.

Audit command:

```bash
python3 scripts/check_assets.py
```

Latest audit result:

- Documentation files scanned: 178
- Asset/media references found: 134
- Local assets OK: 134
- Missing local assets: 0
- Remote media URLs: 0
- Image references missing alt text: 0
- Unused local media candidates under root `assets/`: 13

The checker currently passes.

Note: the Quarto book carries self-contained generated assets under `book/assets/generated/`, including the local architecture image used by the custom Quarto theme. Some root-level generated assets are retained for the legacy static HTML site and future source reuse.

## Broken Local References

| ID | Referenced from | Original reference | Status | Action | Local replacement | Notes |
|---|---|---|---|---|---|---|
| A001 | `part4-ml-foundations/02-ml-as-geometry.html:154` | `assets/images/ml-geometry-points.svg` | OK_LOCAL | Fixed relative path | `assets/images/ml-geometry-points.svg` | Updated legacy HTML references to `../assets/...`. |
| A002 | `part4-ml-foundations/02-ml-as-geometry.html:201` | `assets/images/ml-regression-line.svg` | OK_LOCAL | Fixed relative path | `assets/images/ml-regression-line.svg` | Updated legacy HTML references to `../assets/...`. |
| A003 | `part4-ml-foundations/02-ml-as-geometry.html:254` | `assets/images/ml-classification-boundary.svg` | OK_LOCAL | Fixed relative path | `assets/images/ml-classification-boundary.svg` | Updated legacy HTML references to `../assets/...`. |
| A004 | `part4-ml-foundations/03-linear-regression.html:151` | `assets/images/ml-regression-line.svg` | OK_LOCAL | Fixed relative path | `assets/images/ml-regression-line.svg` | Updated legacy HTML references to `../assets/...`. |
| A005 | `part4-ml-foundations/03-linear-regression.html:343` | `assets/images/pytorch-training-loop.svg` | OK_LOCAL | Fixed relative path | `assets/images/pytorch-training-loop.svg` | Updated legacy HTML references to `../assets/...`. |
| A006 | `part4-ml-foundations/04-linear-classification.html:321` | `assets/images/ch4/svm-separating-hyperplanes.svg` | OK_LOCAL | Fixed relative path | `assets/images/ch4/svm-separating-hyperplanes.svg` | Updated legacy HTML references to `../assets/...`. |
| A007 | `part4-ml-foundations/04-linear-classification.html:376` | `assets/images/ch4/sigmoid-function.svg` | OK_LOCAL | Fixed relative path | `assets/images/ch4/sigmoid-function.svg` | Updated legacy HTML references to `../assets/...`. |
| A008 | `part4-ml-foundations/04-linear-classification.html:444` | `assets/images/ch4/gradient-descent.gif` | OK_LOCAL | Fixed relative path | `assets/images/ch4/gradient-descent.gif` | Updated legacy HTML references to `../assets/...`. |
| A009 | `part4-ml-foundations/04-linear-classification.html:640` | `assets/images/ch4/overfitting.png` | OK_LOCAL | Fixed relative path | `assets/images/ch4/overfitting.png` | Updated legacy HTML references to `../assets/...`. |
| A010 | `part4-ml-foundations/04-linear-classification.html:876` | `assets/images/ch4/bias-variance-total-error.svg` | OK_LOCAL | Fixed relative path | `assets/images/ch4/bias-variance-total-error.svg` | Updated legacy HTML references to `../assets/...`. |
| A011 | `part4-ml-foundations/04-linear-classification.html:917` | `assets/images/ch4/learning-curves-naive-bayes.png` | OK_LOCAL | Fixed relative path | `assets/images/ch4/learning-curves-naive-bayes.png` | Updated legacy HTML references to `../assets/...`. |

## Remote Media Dependencies

These dependencies have been replaced in legacy chapters with local generated assets under `assets/generated/`.

| ID | Referenced from | Original reference | Status | Action | Local replacement | Notes |
|---|---|---|---|---|---|---|
| R001 | `part5-deep-learning-and-llms/01-ffn-concepts.html:99` | `https://upload.wikimedia.org/wikipedia/commons/f/f1/Sigmoid-function.svg` | GENERATED_REPLACEMENT | Replaced with local activation plot | `assets/generated/deep-learning/sigmoid-function.svg` | Prefer generated plot. |
| R002 | `part5-deep-learning-and-llms/01-ffn-concepts.html:195` | `https://upload.wikimedia.org/wikipedia/commons/8/87/Hyperbolic_Tangent.svg` | GENERATED_REPLACEMENT | Replaced with local activation plot | `assets/generated/deep-learning/tanh-function.svg` | Prefer generated plot. |
| R003 | `part5-deep-learning-and-llms/01-ffn-concepts.html:214` | `https://upload.wikimedia.org/wikipedia/commons/9/99/ReLU_Activation_Function_Plot.svg` | GENERATED_REPLACEMENT | Replaced with local activation plot | `assets/generated/deep-learning/relu-function.svg` | Prefer generated plot. |
| R004 | `part5-deep-learning-and-llms/01-ffn-concepts.html:250` | `https://upload.wikimedia.org/wikipedia/commons/e/e4/Sigmoid-derivative.png` | GENERATED_REPLACEMENT | Replaced with local derivative plot | `assets/generated/deep-learning/sigmoid-derivative.png` | Prefer generated plot. |
| R005 | `part5-deep-learning-and-llms/01-ffn-concepts.html:259` | `https://upload.wikimedia.org/wikipedia/commons/f/f4/One-neuron_recurrent_network_bifurcation_diagram.png` | GENERATED_REPLACEMENT | Replaced with simpler local conceptual diagram | `assets/generated/deep-learning/neuron-nonlinearity.svg` | Original may be too advanced for placement. |
| R006 | `part5-deep-learning-and-llms/01-ffn-concepts.html:295` | `https://upload.wikimedia.org/wikipedia/commons/4/4b/Softmax.svg` | GENERATED_REPLACEMENT | Replaced with local softmax diagram | `assets/generated/deep-learning/softmax.svg` | Prefer generated diagram. |
| R007 | `part5-deep-learning-and-llms/01-ffn-concepts.html:302` | `https://upload.wikimedia.org/wikipedia/commons/a/a6/Softmax_en.svg` | GENERATED_REPLACEMENT | Replaced with local softmax diagram | `assets/generated/deep-learning/softmax-probabilities.svg` | Duplicate with R006. |
| R008 | `part5-deep-learning-and-llms/01-ffn-concepts.html:357` | `https://upload.wikimedia.org/wikipedia/commons/2/27/MnistExamples.png` | GENERATED_REPLACEMENT | Replaced with generated synthetic digit-grid or local licensed copy | `assets/generated/deep-learning/synthetic-digit-grid.png` | Avoid dataset image dependency. |
| R009 | `part5-deep-learning-and-llms/01-ffn-concepts.html:365` | `https://upload.wikimedia.org/wikipedia/commons/3/38/T-SNE_Embedding_of_MNIST.png` | GENERATED_REPLACEMENT | Generate conceptual embedding plot | `assets/generated/deep-learning/embedding-clusters.png` | Prefer synthetic data. |
| R010 | `part5-deep-learning-and-llms/02-ffn-training-debugging.html:110` | `https://upload.wikimedia.org/wikipedia/commons/7/7c/Optimizer_Animations.gif` | GENERATED_REPLACEMENT | Generate static gradient descent path | `assets/generated/deep-learning/gradient-descent-path.png` | Static plot is enough. |
| R011 | `part5-deep-learning-and-llms/02-ffn-training-debugging.html:280` | `https://upload.wikimedia.org/wikipedia/commons/a/a6/Softmax_en.svg` | GENERATED_REPLACEMENT | Reuse generated softmax diagram | `assets/generated/deep-learning/softmax-probabilities.svg` | Duplicate with R007. |
| R012 | `part5-deep-learning-and-llms/02-ffn-training-debugging.html:353` | `https://upload.wikimedia.org/wikipedia/commons/5/5a/Confusion_matrix.png` | GENERATED_REPLACEMENT | Replaced with local confusion matrix | `assets/generated/ml/confusion-matrix-example.png` | Also useful for model evaluation chapter. |
| R013 | `part5-deep-learning-and-llms/02-ffn-training-debugging.html:481` | `https://upload.wikimedia.org/wikipedia/commons/8/80/3-D_surface_plot.jpg` | GENERATED_REPLACEMENT | Replaced with local loss surface | `assets/generated/deep-learning/loss-surface.png` | Prefer synthetic plot. |
| R014 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:101` | `https://commons.wikimedia.org/wiki/Special:FilePath/ActivationFunctions.svg` | GENERATED_REPLACEMENT | Generate combined activation plot | `assets/generated/deep-learning/activation-functions.svg` | Canonical duplicate chapter. |
| R015 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:146` | `https://commons.wikimedia.org/wiki/Special:FilePath/Logistic-curve.svg` | GENERATED_REPLACEMENT | Reuse generated sigmoid plot | `assets/generated/deep-learning/sigmoid-function.svg` | Duplicate. |
| R016 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:278` | `https://commons.wikimedia.org/wiki/Special:FilePath/Hyperbolic_Tangent.svg` | GENERATED_REPLACEMENT | Reuse generated tanh plot | `assets/generated/deep-learning/tanh-function.svg` | Duplicate. |
| R017 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:286` | `https://commons.wikimedia.org/wiki/Special:FilePath/Activation_rectified_linear.svg` | GENERATED_REPLACEMENT | Reuse generated ReLU plot | `assets/generated/deep-learning/relu-function.svg` | Duplicate. |
| R018 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:346` | `https://commons.wikimedia.org/wiki/Special:FilePath/Prospects_of_Chain_Rule_of_Differentiations_and_Inverse_of_Multiple_Functions.png` | GENERATED_REPLACEMENT | Replaced with local chain rule diagram | `assets/generated/deep-learning/backprop-chain-rule.svg` | Prefer original diagram. |
| R019 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:445` | `https://commons.wikimedia.org/wiki/Special:FilePath/Softmax_en.svg` | GENERATED_REPLACEMENT | Reuse generated softmax diagram | `assets/generated/deep-learning/softmax-probabilities.svg` | Duplicate. |
| R020 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:452` | `https://commons.wikimedia.org/wiki/Special:FilePath/ConfusionMatrixRedBlue.png` | GENERATED_REPLACEMENT | Reuse generated confusion matrix | `assets/generated/ml/confusion-matrix-example.png` | Duplicate. |
| R021 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:509` | `https://commons.wikimedia.org/wiki/Special:FilePath/RGB_color_cube.svg` | GENERATED_REPLACEMENT | Replaced with local RGB/channel diagram | `assets/generated/deep-learning/rgb-channels.svg` | Could be moved to CNN chapter. |
| R022 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:644` | `https://upload.wikimedia.org/wikipedia/commons/2/27/MnistExamples.png` | GENERATED_REPLACEMENT | Reuse synthetic digit-grid | `assets/generated/deep-learning/synthetic-digit-grid.png` | Duplicate. |
| R023 | `part5-deep-learning-and-llms/03-ffn-canonical-merged.html:668` | `https://commons.wikimedia.org/wiki/Special:FilePath/MnistExamples.png` | GENERATED_REPLACEMENT | Reuse synthetic digit-grid | `assets/generated/deep-learning/synthetic-digit-grid.png` | Duplicate. |
| R024 | `part5-deep-learning-and-llms/04-cnn-convolution.html:109` | `https://upload.wikimedia.org/wikipedia/commons/5/55/Gaussian_blur_effect.png` | GENERATED_REPLACEMENT | Replaced with local blur demo | `assets/generated/deep-learning/gaussian-blur-demo.png` | Use synthetic image. |
| R025 | `part5-deep-learning-and-llms/04-cnn-convolution.html:117` | `https://upload.wikimedia.org/wikipedia/commons/9/9b/Sobel_operator_result_on_gray_image.png` | GENERATED_REPLACEMENT | Replaced with local edge detection demo | `assets/generated/deep-learning/sobel-edge-demo.png` | Use synthetic image. |
| R026 | `part5-deep-learning-and-llms/04-cnn-convolution.html:197` | `https://upload.wikimedia.org/wikipedia/commons/1/19/2D_Convolution_Animation.gif` | GENERATED_REPLACEMENT | Replaced with local convolution illustration | `assets/generated/deep-learning/convolution-window.svg` | Static SVG likely enough. |
| R027 | `part5-deep-learning-and-llms/04-cnn-convolution.html:254` | `https://upload.wikimedia.org/wikipedia/commons/3/3b/Convolution_arithmetic_padding_strides.png` | GENERATED_REPLACEMENT | Replaced with local padding/stride diagram | `assets/generated/deep-learning/convolution-padding-stride.svg` | Prefer SVG. |
| R028 | `part5-deep-learning-and-llms/04-cnn-convolution.html:371` | `https://upload.wikimedia.org/wikipedia/commons/1/1b/Cross-correlation_animation.gif` | GENERATED_REPLACEMENT | Replaced with local correlation diagram | `assets/generated/deep-learning/cross-correlation-window.svg` | Static SVG likely enough. |
| R029 | `part5-deep-learning-and-llms/04-cnn-convolution.html:414` | `https://upload.wikimedia.org/wikipedia/commons/3/3e/Dot_Product.svg` | GENERATED_REPLACEMENT | Replaced with local dot product diagram | `assets/generated/ml/dot-product-geometry.svg` | Also useful in ML foundations. |
| R030 | `part5-deep-learning-and-llms/04-cnn-convolution.html:520` | `https://upload.wikimedia.org/wikipedia/commons/6/63/Typical_cnn.png` | GENERATED_REPLACEMENT | Replaced with local CNN architecture diagram | `assets/generated/deep-learning/cnn-architecture.svg` | Duplicate with R032. |
| R031 | `part5-deep-learning-and-llms/05-cnn-architecture.html:115` | `https://upload.wikimedia.org/wikipedia/commons/2/2b/Rgb_channels_separate.png` | GENERATED_REPLACEMENT | Reuse local RGB/channel diagram | `assets/generated/deep-learning/rgb-channels.svg` | Duplicate concept. |
| R032 | `part5-deep-learning-and-llms/05-cnn-architecture.html:155` | `https://upload.wikimedia.org/wikipedia/commons/6/63/Typical_cnn.png` | GENERATED_REPLACEMENT | Reuse CNN architecture diagram | `assets/generated/deep-learning/cnn-architecture.svg` | Duplicate. |
| R033 | `part5-deep-learning-and-llms/05-cnn-architecture.html:202` | `https://upload.wikimedia.org/wikipedia/commons/3/3b/Convolution_arithmetic_padding_strides.png` | GENERATED_REPLACEMENT | Reuse padding/stride diagram | `assets/generated/deep-learning/convolution-padding-stride.svg` | Duplicate. |
| R034 | `part5-deep-learning-and-llms/05-cnn-architecture.html:307` | `https://upload.wikimedia.org/wikipedia/commons/9/9a/Conv_layer.png` | GENERATED_REPLACEMENT | Replaced with local receptive field diagram | `assets/generated/deep-learning/receptive-field.svg` | Prefer original SVG. |
| R035 | `part5-deep-learning-and-llms/05-cnn-architecture.html:332` | `https://upload.wikimedia.org/wikipedia/commons/6/60/LeNet5.png` | GENERATED_REPLACEMENT | Generate simplified CNN block diagram | `assets/generated/deep-learning/simple-cnn-blocks.svg` | Avoid dependency on historical figure. |
| R036 | `part5-deep-learning-and-llms/05-cnn-architecture.html:407` | `https://upload.wikimedia.org/wikipedia/commons/e/e9/Max_pooling.png` | GENERATED_REPLACEMENT | Replaced with local pooling diagram | `assets/generated/deep-learning/max-pooling.svg` | Prefer SVG. |
| R037 | `part5-deep-learning-and-llms/05-cnn-architecture.html:497` | `https://upload.wikimedia.org/wikipedia/commons/7/7d/Conv_arithmetic_strides.png` | GENERATED_REPLACEMENT | Reuse padding/stride diagram | `assets/generated/deep-learning/convolution-padding-stride.svg` | Duplicate. |
| R038 | `part5-deep-learning-and-llms/05-cnn-architecture.html:566` | `https://upload.wikimedia.org/wikipedia/commons/1/1b/GlobalAveragePooling.png` | GENERATED_REPLACEMENT | Replaced with local pooling diagram | `assets/generated/deep-learning/global-average-pooling.svg` | Prefer SVG. |
| R039 | `part5-deep-learning-and-llms/06-cnn-pytorch-implementation.html:184` | `https://upload.wikimedia.org/wikipedia/commons/1/19/2D_Convolution_Animation.gif` | GENERATED_REPLACEMENT | Reuse convolution-window diagram | `assets/generated/deep-learning/convolution-window.svg` | Duplicate. |
| R040 | `part5-deep-learning-and-llms/06-cnn-pytorch-implementation.html:517` | `https://upload.wikimedia.org/wikipedia/commons/a/a8/Dropout_en.svg` | GENERATED_REPLACEMENT | Replaced with local dropout diagram | `assets/generated/deep-learning/dropout.svg` | Prefer SVG. |
| R041 | `part5-deep-learning-and-llms/06-cnn-pytorch-implementation.html:604` | `https://upload.wikimedia.org/wikipedia/commons/6/63/Conv2d_padding_strides.gif` | GENERATED_REPLACEMENT | Reuse padding/stride diagram | `assets/generated/deep-learning/convolution-padding-stride.svg` | Duplicate. |
| R042 | `part5-deep-learning-and-llms/07-cnn-dropout-train-eval.html:188` | `https://upload.wikimedia.org/wikipedia/commons/a/a8/Dropout_en.svg` | GENERATED_REPLACEMENT | Reuse dropout diagram | `assets/generated/deep-learning/dropout.svg` | Duplicate. |
| R043 | `part5-deep-learning-and-llms/08-forecasting-sequence-data.html:51` | `https://commons.wikimedia.org/wiki/Special:FilePath/COVID-19_Confirmed_Cases.svg?width=1100` | GENERATED_REPLACEMENT | Generate synthetic forecasting plot | `assets/generated/ml/time-series-split.png` | Prefer synthetic data. |
| R044 | `part5-deep-learning-and-llms/09-autoregressive-linear-model.html:52` | `https://upload.wikimedia.org/wikipedia/commons/5/5e/Sine_wave.svg` | GENERATED_REPLACEMENT | Replaced with local sine wave plot | `assets/generated/ml/sine-wave-forecasting.svg` | Easy generated asset. |
| R045 | `part5-deep-learning-and-llms/10-recurrent-neural-networks.html:77` | `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Recurrent_neural_network_unfold.svg/960px-Recurrent_neural_network_unfold.svg.png` | GENERATED_REPLACEMENT | Replaced with local RNN unrolled diagram | `assets/generated/deep-learning/rnn-unrolled.svg` | Prefer SVG. |
| R046 | `part5-deep-learning-and-llms/10-recurrent-neural-networks.html:87` | `https://upload.wikimedia.org/wikipedia/commons/e/e4/DiagramElmanNet_english.png` | GENERATED_REPLACEMENT | Replaced with local recurrent cell diagram | `assets/generated/deep-learning/rnn-cell.svg` | Prefer SVG. |

## Unused Local Media Candidates

The checker reports these as unused because the current references are broken relative paths. They should be reused after path repair or Quarto migration.

| Asset | Status | Recommended action |
|---|---|---|
| `assets/images/ch4/bias-variance-total-error.svg` | REMOVED_UNUSED | Reuse or replace with generated local plot. |
| `assets/images/ch4/gradient-descent.gif` | REMOVED_UNUSED | Reuse if acceptable, or replace with generated static plot. |
| `assets/images/ch4/learning-curves-naive-bayes.png` | REMOVED_UNUSED | Reuse or regenerate. |
| `assets/images/ch4/overfitting.png` | REMOVED_UNUSED | Reuse or regenerate. |
| `assets/images/ch4/sigmoid-function.svg` | REMOVED_UNUSED | Reuse or regenerate. |
| `assets/images/ch4/svm-separating-hyperplanes.svg` | REMOVED_UNUSED | Reuse in classification chapter. |
| `assets/images/ml-classification-boundary.svg` | REMOVED_UNUSED | Reuse in ML foundations. |
| `assets/images/ml-geometry-points.svg` | REMOVED_UNUSED | Reuse in ML foundations. |
| `assets/images/ml-regression-line.svg` | REMOVED_UNUSED | Reuse in linear regression chapter. |
| `assets/images/pytorch-training-loop.svg` | REMOVED_UNUSED | Reuse in PyTorch training chapter. |

## External JavaScript and CSS Dependencies

These are not image/media assets but should be reviewed during migration:

- `assets/js/nav.js` loads Highlight.js from jsDelivr.
- Several math-heavy chapters load MathJax or KaTeX from jsDelivr.
- Appendix wrapper loads `marked` from jsDelivr.

Recommended action:

- Quarto can provide syntax highlighting, math rendering, search, and navigation without most custom runtime dependencies.
- During migration, remove unnecessary CDN dependencies where Quarto provides native support.

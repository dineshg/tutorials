#!/usr/bin/env python3
"""Repair asset references in the legacy static HTML chapters."""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


REMOTE_REPLACEMENTS = {
    "https://upload.wikimedia.org/wikipedia/commons/f/f1/Sigmoid-function.svg": "../assets/generated/deep-learning/sigmoid-function.svg",
    "https://upload.wikimedia.org/wikipedia/commons/8/87/Hyperbolic_Tangent.svg": "../assets/generated/deep-learning/tanh-function.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/99/ReLU_Activation_Function_Plot.svg": "../assets/generated/deep-learning/relu-function.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e4/Sigmoid-derivative.png": "../assets/generated/deep-learning/sigmoid-derivative.svg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f4/One-neuron_recurrent_network_bifurcation_diagram.png": "../assets/generated/deep-learning/neural-network-architecture.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4b/Softmax.svg": "../assets/generated/deep-learning/softmax-probabilities.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/a6/Softmax_en.svg": "../assets/generated/deep-learning/softmax-probabilities.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/27/MnistExamples.png": "../assets/generated/deep-learning/neural-network-architecture.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/38/T-SNE_Embedding_of_MNIST.png": "../assets/generated/deep-learning/neural-network-architecture.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Optimizer_Animations.gif": "../assets/generated/deep-learning/gradient-descent-path.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5a/Confusion_matrix.png": "../assets/generated/ml/confusion-matrix-example.svg",
    "https://upload.wikimedia.org/wikipedia/commons/8/80/3-D_surface_plot.jpg": "../assets/generated/deep-learning/loss-surface.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/ActivationFunctions.svg": "../assets/generated/deep-learning/activation-functions.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Logistic-curve.svg": "../assets/generated/deep-learning/sigmoid-function.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hyperbolic_Tangent.svg": "../assets/generated/deep-learning/tanh-function.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Activation_rectified_linear.svg": "../assets/generated/deep-learning/relu-function.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Prospects_of_Chain_Rule_of_Differentiations_and_Inverse_of_Multiple_Functions.png": "../assets/generated/deep-learning/neural-network-architecture.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Softmax_en.svg": "../assets/generated/deep-learning/softmax-probabilities.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/ConfusionMatrixRedBlue.png": "../assets/generated/ml/confusion-matrix-example.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/RGB_color_cube.svg": "../assets/generated/deep-learning/convolution-window.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/MnistExamples.png": "../assets/generated/deep-learning/neural-network-architecture.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/55/Gaussian_blur_effect.png": "../assets/generated/deep-learning/convolution-window.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9b/Sobel_operator_result_on_gray_image.png": "../assets/generated/deep-learning/convolution-window.svg",
    "https://upload.wikimedia.org/wikipedia/commons/1/19/2D_Convolution_Animation.gif": "../assets/generated/deep-learning/convolution-window.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3b/Convolution_arithmetic_padding_strides.png": "../assets/generated/deep-learning/convolution-padding-stride.svg",
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/Cross-correlation_animation.gif": "../assets/generated/deep-learning/convolution-window.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3e/Dot_Product.svg": "../assets/generated/ml/train-validation-test-split.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/63/Typical_cnn.png": "../assets/generated/deep-learning/convolution-window.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2b/Rgb_channels_separate.png": "../assets/generated/deep-learning/convolution-window.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9a/Conv_layer.png": "../assets/generated/deep-learning/convolution-window.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/60/LeNet5.png": "../assets/generated/deep-learning/convolution-window.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e9/Max_pooling.png": "../assets/generated/deep-learning/max-pooling.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/7d/Conv_arithmetic_strides.png": "../assets/generated/deep-learning/convolution-padding-stride.svg",
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/GlobalAveragePooling.png": "../assets/generated/deep-learning/max-pooling.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dropout_en.svg": "../assets/generated/deep-learning/dropout.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/63/Conv2d_padding_strides.gif": "../assets/generated/deep-learning/convolution-padding-stride.svg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/COVID-19_Confirmed_Cases.svg?width=1100": "../assets/generated/ml/time-series-split.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Sine_wave.svg": "../assets/generated/ml/sine-wave-forecasting.svg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Recurrent_neural_network_unfold.svg/960px-Recurrent_neural_network_unfold.svg.png": "../assets/generated/deep-learning/rnn-unrolled.svg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e4/DiagramElmanNet_english.png": "../assets/generated/deep-learning/rnn-unrolled.svg",
}


def repair_part4_paths() -> int:
    count = 0
    for path in (ROOT / "part4-ml-foundations").glob("*.html"):
        text = path.read_text(encoding="utf-8")
        new = text.replace('src="assets/images/', 'src="../assets/images/')
        count += text != new
        path.write_text(new, encoding="utf-8")
    return count


def repair_remote_media() -> int:
    count = 0
    for path in (ROOT / "part5-deep-learning-and-llms").glob("*.html"):
        text = path.read_text(encoding="utf-8")
        new = text
        for remote, local in REMOTE_REPLACEMENTS.items():
            new = new.replace(remote, local)
        if new != text:
            count += 1
            path.write_text(new, encoding="utf-8")
    return count


if __name__ == "__main__":
    part4 = repair_part4_paths()
    remote = repair_remote_media()
    print(f"Updated {part4} part4 files and {remote} part5 files")

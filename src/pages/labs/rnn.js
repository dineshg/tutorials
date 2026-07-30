import React from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import rnnStandaloneHtml from "@site/src/generated/rnn-standalone.json";
import styles from "./rnn.module.css";

export default function RnnLabPage() {
  return (
    <Layout
      title="Animated RNN companion lab"
      description="An interactive 3D walkthrough of tokens, embeddings, recurrent memory, prediction, and backpropagation through time."
    >
      <main className={styles.labPage}>
        <header className={styles.labHeader}>
          <div>
            <span>Part V · Interactive companion</span>
            <h1>Animated RNN walkthrough</h1>
            <p>
              Explore the complete path from words and token IDs to embeddings,
              recurrent memory, next-token prediction, and learning.
            </p>
          </div>
          <a href={useBaseUrl("/part5-deep-learning-and-llms/10-recurrent-neural-networks")}>
            Read the RNN chapter
          </a>
        </header>
        <iframe
          className={styles.labFrame}
          srcDoc={rnnStandaloneHtml}
          title="Interactive animated recurrent neural network tutorial"
          allow="autoplay"
        />
      </main>
    </Layout>
  );
}

// Sample markdown content for testing summary rendering

export const SAMPLE_MARKDOWN_CONTENT = `# Introduction to Machine Learning

Machine Learning is a subset of **artificial intelligence** that enables systems to learn and improve from experience without being explicitly programmed.

## Key Concepts

### Supervised Learning
Supervised learning uses labeled datasets to train algorithms. The model learns to map inputs to outputs based on example input-output pairs.

- Classification: Predicting categorical labels
- Regression: Predicting continuous values
- Common algorithms: \`Linear Regression\`, \`Decision Trees\`, \`SVM\`

### Unsupervised Learning
Unsupervised learning finds patterns in unlabeled data:

1. **Clustering**: Grouping similar data points
2. **Dimensionality Reduction**: Reducing feature space
3. **Association**: Finding rules in data

> "The goal of machine learning is to program computers to use example data or past experience to solve a given problem." — Tom Mitchell

---

## Comparison of Algorithms

| Algorithm | Type | Use Case | Complexity |
|-----------|------|----------|------------|
| Linear Regression | Supervised | Prediction | Low |
| K-Means | Unsupervised | Clustering | Medium |
| Neural Networks | Both | Various | High |
| Random Forest | Supervised | Classification | Medium |

## Code Example

Here's a simple example of inline code: \`model.fit(X_train, y_train)\`

## Important Notes

- Always **normalize** your data before training
- Split data into *training* and *testing* sets
- Use cross-validation for better evaluation
- Monitor for overfitting and underfitting

### Best Practices

1. Start with simple models
2. Iterate and improve gradually
3. Document your experiments
4. Version control your models

---

## Conclusion

Machine learning continues to evolve rapidly. Understanding these fundamentals is crucial for building effective AI systems.

> Key takeaway: Start simple, measure everything, and iterate based on data.
`;

export const SAMPLE_KEY_POINTS = [
  "Machine Learning enables systems to learn from experience without explicit programming",
  "Supervised learning uses labeled data, while unsupervised learning finds patterns in unlabeled data",
  "Common algorithms include Linear Regression, Decision Trees, K-Means, and Neural Networks",
  "Best practices include data normalization, train/test splitting, and cross-validation",
  "Start simple and iterate based on measured results"
];

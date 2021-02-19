# Import libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.decomposition import PCA
from sklearn.pipeline import Pipeline
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import OneHotEncoder


# @Arguments: filename
# @Returns: dataframe
def get_data(fileName):
    return (pd.read_csv(fileName))


# @Arguments: array of categorical data
# @Returns: one hot data representations
def get_onehot(data):
    onehot = OneHotEncoder(sparse=False)
    one_hotData = onehot.fit_transform(data)
    return (one_hotData)


# @Arguments: Takes numerical and categorical featuers(onehot)
# @Returns: final features list
def make_features(num_feats, cat_feats):
    num_feats = np.array(num_feats.values)
    finalFeats = np.hstack((num_feats, cat_feats))
    return (finalFeats)


# @Arguments: filename
# @Returns: df and features(with one hot representations)
def make_data(fileName):
    df = get_data(fileName)
    num_features = df[[
        'MPG', 'Horsepower', 'Cylinders', 'Displacement', 'Weight',
        'Acceleration', 'Year'
    ]]
    cat_data = df['Origin']
    cat_features = get_onehot(cat_data.values.reshape(-1, 1))

    features = make_features(num_features, cat_features)
    labels = df['Model']

    return (df, features)


# @Arguments: features data
# @PCA components
def pca_model(features, origin=True, jitter=True):
    # pca = pca(n_components=2)
    # scale = MinMaxScaler()
    pipe = make_pipeline(MinMaxScaler(), PCA(n_components=2))
    if origin:
        pca_components = pipe.fit_transform(
            features[:, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]])
    else:
        pca_components = pipe.fit_transform(features[:, [0, 1, 2, 3, 4, 5, 6]])

    pca1, pca2 = jitter_values(pca_components, jitter)
    return (pca1, pca2)


# @Argument:s pca data
# @Plots: Scatter
def plot_data(dfData):
    plt.figure(figsize=(15, 15))

    group_data = dfData.groupby('Origin')
    for group in group_data.groups:
        df = group_data.get_group(group)
        plt.scatter(df['pca1'], df['pca2'], label=group)

    plt.title('Visualizing pca components in a scatter plot')
    plt.legend()
    plt.savefig("pca_Jitter.jpg")
    plt.show()


# @Arguments: dfData, pca_componets
# @PCA components
def append_data(dfData, pcaa, pca2):
    dfData['pca1'] = pca1
    dfData['pca2'] = pca2
    plot_data(dfData)
    dfData.to_csv('../Data/pca_cars_Jitter.csv')
    return (dfData)


# @Arguments: pca_components array (size [nx2]), jitter (True by default)
# @Returns: pca1, pca2 values with or without jitter
def jitter_values(pca_components, jitter):
    pca1 = np.take(pca_components, 0, axis=1)
    pca2 = np.take(pca_components, 1, axis=1)

    if jitter:
        pca1 = pca1 + np.random.uniform(-0.15, 0.15, len(pca1))
        pca2 = pca2 + np.random.uniform(-0.25, 0.25, len(pca2))
    return pca1, pca2


if __name__ == "__main__":
    fileName = "../Data/cars.csv"
    dfData, features = make_data(fileName)

    # Jitter is applied only after pca components are derived.
    pca1, pca2 = pca_model(features, origin=True, jitter=True)
    # Storing data and plotting scatter
    final_data = append_data(dfData, pca1, pca2)

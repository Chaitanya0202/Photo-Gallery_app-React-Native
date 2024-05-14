import React, { useState, useEffect } from "react";
import { Button, Text, SafeAreaView, ScrollView, StyleSheet, Image, View, Platform, TouchableOpacity } from "react-native";
import * as MediaLibrary from "expo-media-library";
import PhotoViewer from "./PhotoViewer"; // Import the PhotoViewer component

export default function ImageGallery() {
  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  async function getAlbums() {
    if (permissionResponse.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={getAlbums} title="Get albums" />
      <ScrollView>
        {albums &&
          albums.map((album) => (
            <AlbumEntry key={album.id} album={album} onSelectPhoto={setSelectedPhoto} setModalVisible={setModalVisible} />
          ))}
      </ScrollView>
      <PhotoViewer uri={selectedPhoto} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

function AlbumEntry({ album, onSelectPhoto, setModalVisible }) {
  const [assets, setAssets] = useState([]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    async function getAlbumAssets() {
      const { assets: allAssets } = await MediaLibrary.getAssetsAsync({
        album,
        first: showAllPhotos ? 1000 : 5, // Fetch a large number of assets if showAllPhotos is true, else fetch a small number
      });
      setAssets(allAssets);
    }

    getAlbumAssets();
  }, [album, showAllPhotos]);

  return (
    <View key={album.id} style={styles.albumContainer}>
      <Text>
        {album.title} - {album.assetCount ?? "no"} assets
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => setShowAllPhotos((prev) => !prev)}
          title={showAllPhotos ? "Hide All Photos" : "Show All Photos"}
        />
      </View>
      <View style={styles.albumAssetsContainer}>
        {assets.map((asset) => (
          <TouchableOpacity key={asset.id} onPress={() => { onSelectPhoto(asset.uri); setModalVisible(true); }}>
            <Image source={{ uri: asset.uri }} style={styles.thumbnailImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  albumContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  albumAssetsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

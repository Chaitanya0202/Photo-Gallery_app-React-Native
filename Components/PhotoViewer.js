import React from 'react';
import { Modal, Image, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';

const PhotoViewer = ({ uri, visible, onClose }) => {
  const renderImage = uri ? (
    <Image source={{ uri }} style={styles.photo} resizeMode="contain" />
  ) : null;

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image source={require('../assets/icon.png')} style={styles.closeIcon} />
        </TouchableOpacity>
        {renderImage}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
  },
  closeIcon: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  photo: {
    width: '90%',
    height: '90%',
  },
});

export default PhotoViewer;

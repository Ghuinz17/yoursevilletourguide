import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from './TourImagePickerStyles';

interface TourImagePickerProps {
  initialImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const TourImagePicker: React.FC<TourImagePickerProps> = ({
  initialImages = [],
  onImagesChange,
  maxImages = 10,
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Se requieren permisos para la galería');
      return false;
    }
    return true;
  };

  const pickImagesFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (images.length >= maxImages) {
      Alert.alert('Límite', `Máximo ${maxImages} imágenes`);
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        const remainingSlots = maxImages - images.length;
        const imagesToAdd = newImages.slice(0, remainingSlots);

        const updatedImages = [...images, ...imagesToAdd];
        setImages(updatedImages);
        onImagesChange(updatedImages);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Se requiere acceso a la cámara');
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const updatedImages = [...images, result.assets[0].uri];
        setImages(updatedImages);
        onImagesChange(updatedImages);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo capturar la foto');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Imágenes del Tour</Text>
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                <Ionicons name="close-circle" size={28} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={pickImagesFromGallery} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <><Ionicons name="images-outline" size={24} color="#fff" /><Text style={styles.buttonText}>Galería</Text></>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={takePhoto} disabled={loading}>
          <Ionicons name="camera-outline" size={24} color="#fff" /><Text style={styles.buttonText}>Cámara</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
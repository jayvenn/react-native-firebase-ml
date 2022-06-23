import { Alert, Button, View, Image, Text, StyleSheet } from 'react-native';
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker';
import { useState } from 'react';

function ImagePicker() {
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [pickedImage, setPickedImage] = useState('');
    async function verifyPermissions() {
        if (cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        if (cameraPermissionInformation?.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permissions',
                'You need to grant camera permissions for this app.'
            );
            return false;
        }
        return true;
    }
    async function takeImageHandler() {
        const isPermissible = await verifyPermissions();
        if (!isPermissible) {
            return;
        }
        const result = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });
        if (!result.cancelled) {
            setPickedImage(result.uri)
        }
    }
    let imagePreview = <Text>No image taken yet.</Text>
    if (pickedImage) {
        imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
    }
    return (
        <View>
            <View style={styles.imagePreview}>{imagePreview}</View>
            <Button title='Take Image' onPress={takeImageHandler} />
        </View >
    );
};

export default ImagePicker;

const styles = StyleSheet.create({
    imagePreview: {
        resizeMode: 'contain',
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(153, 204, 255, 1)',
        borderRadius: 4
    },
    image: {
        width: '100%',
        height: '100%'
    }
});